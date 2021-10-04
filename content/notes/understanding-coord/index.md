---
title: "Understanding Sequence Coordination in xv6"
date: "2021-07-02T22:12:03.284Z"
description: "Coordination or synchronisation is a fundamental building-block for thread programming. We will discuss the main way xv6 does this - sleep/wakeup mechanism..."
tags: ["os", "fundamental"]
---

```toc
# This code block gets replaced with the TOC
```

## Key concepts
Coordination or synchronisation is a fundamental building-block for thread programming. We will discuss the main way xv6 does this - sleep/wakeup mechanism. 

Threads need to wait for specific events or conditions:
- wait for disk read to complete (event is from an interrupt)
- wait for pipe writer to produce data (event is from a thread)
- wait for any child to exit

**Some possible solutions:**

Busy waiting is inefficient: Just have a while-loop that spins until event happens?
```
pipe read:
  while buffer is empty {}

pipe write:
  put data in buffer
```

A better solution: coordination primitives that yield the CPU there are a bunch e.g. barriers, semaphores, event queues. xv6 uses sleep & wakeup.

## Sleep and wakeup 

To examine the usage of sleep and wakeup, let's consider the UART (I/O device). The UART can only accept one (really a few) bytes of output at a time and takes a long time to send each byte, perhaps millisecond. 

- Processes writing the console must wait until UART sends prev char.
- The UART interrupts after it has sent each character
- Writing thread should give up the CPU until then (since it is just waiting for UART - not utilising CPU) 

Sleep and wakeup mechanism is simple and flexible:
- Sleep/wakeup don't need to understand what you're waiting for
- There's no need to allocate explicit coordination objects

### Lost wakeup problem 

Lost wakeup is a common problem faced when dealing with coordination problems. We will illustrate this problem via an example with UART: 

```c
int done; // shared data, need lock e.g. uart_tx_lock is a lock protecting the condition. Both functions need to acquire this lock. 

// Where to place lock?
uartwrite(buf):
  // acquire(uart_tx_lock)
  for each char c:
    while not done:
      // release(uart_tx_lock)
      // P1. Wakeup could be lost during window of time when lock is released and before sleep.
      sleep(&done) // sleep on a channel (which is usually the address of a shared data structure)
      // acquire(uart_tx_lock)
    send c
    done = false

uartintr():
  // acquire(uart_tx_lock)
  done = true
  wakeup(&done)
  // release(uart_tx_lock)
```

Note that all locks (except from the process lock `p->lock`) has to be released before thread switch (sched) as discussed [here](https://melodiessim.netlify.app/understanding-thread-switching/). If we don't release the uart_tx_lock lock before we switch the thread (by running sleep and sched), we will encounter a deadlock where the while not done loop will always be true, but uartintr cannot acquire lock to modify done. 

If we use the naive method of implementing a single lock uart_tx_lock and releasing it before sleep, a lost wakeup problem could occur when an interrupt (thread switches) is called at point P1, and `uartintr` acquires the lock and runs wakeup before sleep is called. After the thread switches back, `sleep` is called, and the thread sleeps forever even though `done == 1`.  

### xv6 Implementation

To solve this problem, xv6 introduces the need to acquire the process lock before releasing the condition lock `uart_tx_lock`, i.e. we use 2 locks instead of 1. In particular, the process lock is a special lock which is release by the scheduler after context switching, thus we don't have to manually release it.

```c
// Atomically release lock and sleep on chan.
// Reacquires lock when awakened.
void sleep(void *chan, struct spinlock *lk)
{
  struct proc *p = myproc();
  
  // Must acquire p->lock in order to
  // change p->state and then call sched.
  // Once we hold p->lock, we can be
  // guaranteed that we won't miss any wakeup
  // (wakeup locks p->lock),
  // so it's okay to release lk.
  if(lk != &p->lock){  //DOC: sleeplock0
    acquire(&p->lock);  //DOC: sleeplock1
    release(lk);
  }

  // Go to sleep.
  p->chan = chan;
  p->state = SLEEPING;

  sched();

  // Tidy up.
  p->chan = 0;

  // Reacquire original lock.
  if(lk != &p->lock){
    release(&p->lock);
    acquire(lk);
  }
}


// Wake up all processes sleeping on chan.
// Must be called without any p->lock.
void wakeup(void *chan)
{
  struct proc *p;

  for(p = proc; p < &proc[NPROC]; p++) {
    acquire(&p->lock);
    if(p->state == SLEEPING && p->chan == chan) {
      p->state = RUNNABLE;
    }
    release(&p->lock);
  }
}
```


### Improvements (Linux)
#### Inefficiency of scanning entire process list 
Scanning the entire process list in wakeup for processes with a matching `chan` is inefficient. A better solution is to replace the chan in both sleep and wakeup with a data structure that holds a list of processes sleeping on that structure such as Linux wait queue. The Linux wait queue has its own internal lock. 


#### Thundering herd
The implementation of wakeup wakes up all processes that are waiting on a particular channel, and it might be the case that many processes are waiting for that particular channel. The operating system will schedule all these processes and they will race to check the sleep condition.

Processes that behave in this way are sometimes called a thundering herd, and it is best avoided.

Most condition variables have two primitives for wakeup: signal, which wakes up one process, and broadcast, which wakes up all waiting processes. 

## References
[1] https://pdos.csail.mit.edu/6.S081/2020/lec/l-coordination.txt 

[2] https://www.youtube.com/watch?v=gP67sJ4PTnc