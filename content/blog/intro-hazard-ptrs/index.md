---
title: "First Look at Hazard Pointers"
date: "2021-10-23T22:12:03.284Z"
description: "Hazard pointers are a solution to safe memory reclaimation to lock-free concurrent objects. To motivate the use of hazard pointers, let us consider a problem: we want to implement a concurrent key-value map that satisfy the Write-Rarely-Read-Many (WRRM) property..."
tags: ["cpp", "reclaimation", "lock-free"]
---

```toc
# This code block gets replaced with the TOC
```

Two weeks ago, I was reading through an implementation of a C++ concurrent map and the use of hazard pointers caught my attention. Hazard pointers are a solution to safe memory reclaimation to lock-free concurrent objects. 

This note is by no means a manual for understanding hazard pointers in details. The objective of writing this note is mainly to summarise the high level understanding I've learnt so far (and also to satisfy my Hacktoberfest PR requirement :p). I have written this note with C++ in mind - i.e. a non-garbage collected environment. I might have also included some C++ standard functions as examples.  

## The motivating problem
To motivate the use of hazard pointers, let us consider a problem: we want to implement a concurrent key-value map that satisfy the Write-Rarely-Read-Many (WRRM) property. WRRM maps are commonly used as caches, and in use cases such as a lookup table for currency to exchange rates where the map is looked up many times but only updated at a comparatively much slower rate. 

In other words, we want to implement a multithreaded-access map interface, using a single threaded map object such as `std::map`. 

## Downsides to a lock-based implementation 

Consider a simple lock-based implementation. A lock is used (e.g. `std::mutex`) to synchronise access to the map. So our data structure looks like: 

```cpp
// A lockful implementation of WRRMMap [1]
template <class K, class V>
class WRRMMap {
  Mutex mtx_;
  Map<K, V> map_;
public:
  V Lookup(const K& k) {
    Lock lock(mtx_);
    return map_[k];
  }
  void Update(const K& k, const V& v) {
    Lock lock(mtx_);
    map_.insert(make_pair(k, v));
  }
};
```

Clearly this isn't as efficient as it can be. Every lookup acquires the lock exclusively. We can improve by using `rlock()` and `wlock()`. However, it is still a cost that multiple reads have to acquire and release a lock, when parallel lookups do not need affect each other at all, and by the spec, we have more Lookups than Updates. Furthermore, a deadlock can happen if a thread holding the lock dies or is infinitely delayed. 

## What is lock-free and wait-free? 
Clearly, the lock-based approach has its downsides. What are the alternatives? 

A "lock-free" procedure guarantees progress of at least one thread executing the procedure, even if some other threads are delayed arbitrarily. "Wait-free" on the other hand entails a stronger requirement: all threads are guarantted to be able to make process - no thread can be blocked by other threads. Lock-based solutions cannot provide any of the above guarantees. 

From their definition, lock-free and wait-free algorithms enjoy these advantages over their lock-based counterparts: 

1. Thread-killing immunity: Any thread forcefully killed in the system will not delay other threads. 
2. Signal immunity: Similar idea to point 1. No thread will be blocked by another thread being interrupted or killed. 
3. Priority invesion immunity: Priority invesion occurs when a low-priority thread holds a lock to a higher priority thread. This problem is avoided by removing locks from the solution. 

## A lock-free attempt: reference counting

Back to WRRM: How can we implement a lock-free solution? Let's stand back and look at what we ideally want: 
1. Reads has no locking at all. 
2. Updates can make a copy of the entire map, update the copy and try to CAS it with the old map. Note that we are making use of CAS (atomic operations) instead of locks. Here, we make a simplification of the solution by making a copy of the entire map but the same concepts can be applied if we simply make a copy of the value in the map that we want to modify. 
3. Because CAS is limited in how many bytes it can swap, we store the Map as a pointer. 

```cpp
// A naive lock-free implementation of WRRMMap using CAS
// Adapted from [1]
template <class K, class V>
class WRRMMap {
  Map<K, V>* pMap_;
public:
  V Lookup(const K& k) { 
    return (*pMap_)[k]; // no locks
  }
  void Update(const K& k,  V& v) {
    Map<K, V>* newMap = 0;
    do {
      // Make a copy of oldMap 
      // Create new map 
      // Check-and-swap if pMap == oldMap, i.e. no other writer has updated pMap
    } while (!CAS(&pMap_, oldMap, newMap));
    // DON’T delete pMap_!
  }
};
```

Note that we cannot delete pMap after an Update, because there might still be other threads that are reading the old version of the map! If a reader goes to dereference a pointer to a deleted object, it will read corrupt data or access unmapped memory.   

In a garbage collected environment, this implementation would work and we can all go home. However, in C++ land, we need to find a way to safely reclaimed the memory of the old versions of the map once it's no longer read by any threads. 

To do so, we can make use of a reference count to keep track of the number of readers that are still accessing the old pointer to the map. Lookups increment the reference count before accessing the map and decrement it after they are done. Writers can only update and delete the old map when the reference count is 1 (i.e. the updating thread is the only one referencing this old version of the map). Another way this can be implemented is by using a `std::atomic_shared_ptr` to the underlying `std::map`, which will be deallocated automatically when the reference count drops to 0. 

The main downside of this approach is that every lookup and update will have to modify this shared reference count variable, and this can lead to very high contention. This is not ideal in a performant sensitive use case where the shared object is accessed in a hot path.

How can we do better? 

## Hazard pointers to the rescue: a high level overview

### The main idea

In the high level, hazard pointers are a safe, efficient mechanism for threads to advertise to all other threads about their memory usage of shared objects. We will see how we can make use of this to solve our reclaimation problem in WRRM, while avoiding update starvation and high contention.  

The main idea is as follows: Each reader thread will own a *hazard pointer* which is implemented as a single-writer, multi-reader shared pointer. By assigning the address of a map to the hazard pointer, the reader is announcing that this map is in use *(hazardous)* and shouldn't be deleted. Writer threads will have to check hazard pointers of all readers before they can delete any replaced maps. 

Notice that the processes of deleting the old map and updating to a new map can be separated - only the deletion of the old map should be blocked by the readers who are still referencing it. Writers can update the pointer to a new map, so that subsequent readers will read the new map, while deferring the reclaimation of older maps. 

We introduce a new concept `retire` here. Whenever a writer thread updates a map, instead of deallocating the old map, it will retire the old pointer to a private thread-local list. After accumulating some number of retired maps, the thread will scan through the hazard pointer of the readers, and deallocated the old maps that are no longer have threads referencing them. This way we defer reclaimation, and at the same time updates are no longer blocked by constant stream of readers. We also no longer depend on a single reference count variable, and thus, avoid problem of high contention. 

In summary, both lookup and update are lock-free: readers don't lock writers, or get in each other's way. It is perfect for WRRM as reads are very fast (no need to increment/decrement a highly contended shared count), and updates are still fast and guaranteed to make global progress. 

### Digging deeper into the implementation (optional)
For some of you curious creatures out there, the high-level explanation may not satiate your quest to understand how hazard pointers are used and implemented here. I've adapted a short section here from [2] to attempt to add more depth to the  explanation above. The best bet moving forward from here is to read the references listed below and the folly HazPtr source code. 

The main shared structure used in this solution is a singly-linked list of hazard pointers. Each node (`HPRecType`) of the list contains the hazard pointer (`pHazard_`), a flag that indicates if the hazard point is in use (`pActive_`) and the pointer to the next node in the list. `HPRecType` exposes two primitives: `Acquire` and `Release`.

In Lookup, the reader needs to `Acquire` a `HPRecType` before accessing the WRRM and update the hazard pointer with the address of the map it is going to reference. Doing so, it will announce to all writers that the map is not safe to reclaim. The process of `Acquire` involves iterating the global linked list and "claiming" the first hazard pointer that is not in used. In this case, we choose to reuse the hazard pointer to avoid always having to create and allocate new memory for a new hazard pointer. Once the reader is done accessing the map, it invokes `Release`, resetting `pHazard_` and `pActive_` to the default values.

Each thread owns a thread-local vector of retired maps. Since this vector is only accessed by one thread, it does not require to be synchronized. The scanning process for maps to deallocate, is basically the same as performing a set difference between the list of retired maps and list of map that are currently pointed to by hazard pointers. 

## References
If this topic interests you, I would highly recommend you to read the sources which are critical to writing this note. In particular, [1-2] give a more detailed analysis and more code examples on solving the WRRM problem. In [3] Jon did a really excellent job in explaining hazard pointers in the first 30 minutes of his video. 

[1] Andrei Alexandrescu (2007). Lock-Free Data Structures. 

[2] Andrei Alexandrescu, Maged Michael (2004). Lock-Free Data Structures with Hazard Pointers.

[3] Jon Gjenghset (2021). Implementing Hazard Pointers in Rust. https://youtu.be/fvcbyCYdR10 


## Epilogue 
I have had a really fun time learning about hazard pointers and writing this note. Personally, I'm still very curious on how hazard pointers are implemented underneath the hood but that would be a project for another weekend. I've linked the [folly implementation of HazPtr here](https://github.com/facebook/folly/blob/main/folly/synchronization/Hazptr.h ) if you happen to feel the same way. :)

