---
title: Import images dynamically using require.context 
date: "2019-12-27T22:12:03.284Z"
description: " The problem was trying to display an arbitrary number of images, each with a filename not known before hand ..."
---
A friend recently asked me a perculiar problem. She was trying to build a carousel that cycles through multiple images in a directory for a React app bootstrapped using Create-react-app.

While hard-coding for a couple of images seem like a trivial solution, the problem was trying to display an arbitrary number of images, each with a filename not known before hand.

**Psst**: If you want the tldr fix, scroll right down to the bottom. In the next section, I’ll briefly document what I have tried why trying to solve this issue. 

##### Attempt 1

#### Read filenames from dir

First, I read in filenames using `fs.readdirSync()`, a method that returns an array of filenames in the given directory.

```javascript
const imgFolder = './assets/';
const fs = require('fs');

fs.readdirSync(imgFolder).forEach(file => {
  console.log(file); // 'brave.png'
});
```

#### Use a `for` loop and require image individually

```javascript
const imgFolder = './assets/';
const fs = require('fs');

fs.readdirSync(imgFolder).forEach(file => {
  const img_src = require(`${imgFolder}${file}`);
  return <img src={img_src}/>;
});
```

This, however, raised an error of the form: the path './assets/brave.png' cannot be found in the browser (the compilation was successfully using npm start).

After researching more, I realised that `require` only work with static paths (i.e. a hardcoded path instead of a path stored in a variable). This is because Create-react-app uses Webpack under the hood [1] and as a bundler, you have to specify a context where the images are loaded. 

One of the main features of webpack's compiler is to recursively parse all the modules and to build a graph of module dependencies. The definition of context in Webpack is used as a base to resolve paths to modules. For instance, the default context is __dirname. [2]

##### Attempt 2: Solution

#### Using `require.context` to create a customised context

You can create your own context with the `require.context` function. It allows you to pass three parameters: [3]

- the directory to match within,
- a boolean flag to include or exclude subdirectories,
- a regular expression to match files against.

```javascript
require.context(directory, useSubdirectories = false, regExp = /^**\.\/**/)

// To solve the problem
const imgFolder = require.context('./assets/', useSubdirectories = false)
const img_node = images(`./${someVariable}.png`);
return <img src={img_node}/>;
```

To read more about `require.context` and how it can import multiple contexts at once refer to [3].

### References

[1] [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app)

[2] [https://stackoverflow.com/questions/54059179/what-is-require-context](https://stackoverflow.com/questions/54059179/what-is-require-context)

[3] [https://webpack.js.org/guides/dependency-management/](https://webpack.js.org/guides/dependency-management/)