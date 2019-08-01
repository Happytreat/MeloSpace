---
title: How to use Promise.all for multiple async functions
date: "2019-08-01T22:12:03.284Z"
description: "Some of the ways I get to keep myself updated with the technology in the field is
              through atending tech meetups and listening to podcasts. ..."
---
#### *Disclaimer:*
 This article assumes basic knowledge of asynchronous events in Javascript and what 
              ```Promise``` is. A great overview of Promise can be found [here](https://developers.google.com/web/fundamentals/primers/promises). 
              Let's dive in!
     
#### Asynchronous Javascript 
              
I have always found ```Promise``` both a fascinating but annoying concept to use. As Javascript is single-threaded, 
```Promise``` and ```async await``` provides a way for asynchronous events to occur, hence creating
an illusion of "multi-threadedness". 

Consider a simple example: We are able to do something else like return an image in our browsers 
while waiting for an api call to fetch.
```javascript
async function asyncFunc () {
  const data = await fetch(api)
  // do something else
}
````

#### Performing multiple async functions in a loop
Now what if we want to perform multiple async functions say in a forEach loop? 

Consider this case: I have an array ```data``` where I want to perform an async function ```asyncFunc()``` on each of
the element of the array. 

##### Try 1: 
```javascript
data.forEach(async (x) => {
  await asyncFunc(x);
})
````

This doesn't work as the forEach function iterates through the elements of ```data``` before the 
asynchronous events can execute. So in actual fact, asyncFunc(x) doesn't have the chance to execute!

How about let's try to add ```await``` in front of the forEach function? This doesn't work because
we can only use ```await``` in an ```async``` function. 

Refer to this [Medium post](https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404) for more details on why ```async await``` does not work with ```forEach```.


##### Try 2: 
```javascript
await Promise.all(data.map(async (x) => {
  return asyncFunc(x);
}))
````

As the title of this post suggests we have to use Promise.all somehow. So how does Try 2 work when Try 1 doesn't?
Let's break it down step by step from the nested function out: 

```javascript
// 1. Returns a promise due to the async nature of asyncFunc
async (x) => {
  return asyncFunc(x);
}
// 2. .map thus returns an array of Promises
data.map(async (x) => {
  return asyncFunc(x);
})

// 3. We wrap the array of Promises using Promise.all and await for all to succeed or at least 1 to fail
await Promise.all(data.map(async (x) => {
  return asyncFunc(x);
}))
````

As some of your might have noticed, ```Promise.all``` short-circuits and throws an error when at 
least one of the promise fails, discarding the results of other promises. 

```Promise.allSettled()``` is a new Javascript function that returns a promise that resolves after all
 of the given promises have either resolved or rejected, with an array of objects that each describe 
 the outcome of each promise. Check out the [official docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) for 
 more information.








