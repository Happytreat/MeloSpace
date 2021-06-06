---
title: "Debugging with GDB"
date: "2021-06-06T22:12:03.284Z"
description: "Collection of useful GDB commands"
tags: ["gdb", "c", "cpp"]
---

```toc
# This code block gets replaced with the TOC
```

## Basic Commands

```
1. b <location> // breakpoint (ocation an be memory addresses or names e.g. monitor.c:71, main, *0x7c00)
- b <location> if <condition>

2. c // continue running till breakpoint or interrupt
3. s // will step into functions
4. n // step over functions
5. si // same as s but for assembly instructions
6. ni // same as n but for assembly instructions
7. finish // runs code until the current function returns
8. advance <location> // runs code until the instructionpointer gets to the specified location.
```

### Watchpoints
Like breakpoints, but with more complicated conditions.

- `watch <expression>` will stop execution whenever the expression’s value changes.\
- `watch -l <address>` will stop execution whenever the contents of the specified memory address change.

### Examining
- `x` prints the raw contents of memory in whatever format you specify (`x/x` for hexadecimal, `x/i` for assembly, `x/d` for decimals etc).

- `print` evaluates a C expression and prints the result as its proper type. It is often more useful than `x`. e.g. `p *((struct elfhdr *) 0x10000)`

- `info registers` prints the value of every register.

- `i frame` or `info frame` prints the current stack frame.

- `i args` followed by `p *argv@argc`: prints out the arguments to the function
  
- `i locals`: prints info about local variables 

- `bt` or `backtrace`: get the full backtrace of all stack frames. Followed by `frame <no>` and `i frame` to inspect in more details. 

## TUI (Text User Interface)

TUI is a terminal interface which uses the curses library to show the source file, the assembly output, the program registers and GDB commands in separate text windows.

```
1. tui enable
2. layout asm // view assembly code
3. layout reg // view registers
4. focus reg // can scroll reg window 
5. layout split // C source code and asm 
```