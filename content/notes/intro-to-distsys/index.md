---
title: "An overview of MIT 6.824"
date: "2021-04-08T22:12:03.284Z"
description: "What is MIT 6.824: Distributed System all about and why I decided to take it? ..."
---

### What I understand of Distributed System? 

Distributed systems tackle the problem of Performance Scalability, in particular
horizontal scaliability: how can we improve throughput by N times, given we have
~ N machines. 
- Usually this is not straightforward, as there can be bottlenecks introduced or failures. 

### Why I chose to take this course?

- interesting -- hard problems, non-obvious solutions
- active research area -- lots of progress + big unsolved problems
- used by real systems -- unlike 10 years ago -- driven by the rise of big Web sites
- hands-on -- you'll build a real system in the labs

### Main topics cover by the course

1. 3 main abstractions for distributed infrastructure

    - Storage systems (e.g. Memcache at Facebook)
    - Computation systems (e.g. MapReduce)
    - Communication models (e.g. Network, Reliability)

2. Implementation of these abstractions including

    - RPC
    - Threads

3. Fault tolerance in the form of: 

    - Availability 
    - Recoverability 
    - Common strategies include Replication, Non-volatile Storage

4. Consistency 

    - Intuition: Usually we have multiple replicas of the same data, how can we talk about consistency between these replicas?

--- 

### Useful links for the course
1. Official 2020 Course Schedule https://pdos.csail.mit.edu/6.824/schedule.html 

2. 2015 Notes for the course https://wizardforcel.gitbooks.io/distributed-systems-engineering-lecture-notes/content/l01-intro.html 