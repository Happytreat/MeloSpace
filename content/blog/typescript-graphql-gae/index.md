---
title: Lessons learnt from Hosting a Graphql server on GAE with Cloud Firestore
date: "2020-05-07T22:12:03.284Z"
description: "This article will be a quick guide on how to bootstrap a Graphql server on Google App Engine, using Firestore as a cloud database..."
---

This article will be a quick guide on how to bootstrap a Graphql server on Google App Engine, using Firestore as a cloud database.

Stack used:

- Typescript
- GraphQL (Apollo Server with Express)
- Google App Engine (hosted on)
- Firestore

Access the code here: https://github.com/Happytreat/graphql-ts-gae-boilerplate.

### 1. Setup a Typescript project

First, run `yarn init` and follow the prompts to setup your project. The entry point for this project is dist/index.js for ts.

Next, we will be installing some dependencies to transpile ts.

`yarn global add tsc`

`yarn add tslint @types/node tslint-config-airbnb typescript ts-node-dev --dev`

`tsconfig.json`
It is important to set target as "es6" to avoid errors later with typescript.

```Json
{
	"compilerOptions": {
		"target": "es6",
		"module": "commonjs",
		"strict": true,
		"outDir": "./dist",
		"sourceMap": true,
		"esModuleInterop": true,
		"resolveJsonModule": true
	},
	"include": ["src/*"],
	"exclude": ["node_modules", "**/*.spec.ts"]
}
```

`tslint.json` - A really barebone tslint config using airbnb style guide.

```Json
{
	"defaultSeverity": "error",
	"extends": "tslint-config-airbnb",
	"jsRules": {},
	"rules": {
		"eofline": false
	},
	"rulesDirectory": []
}
```

In the `package.json`, add the following scripts:

```Json
"scripts": {
		"start": "tsc && node ./dist/index.js",
		"dev": "ts-node-dev --no-notify --respawn --transpileOnly src/index"
	},
```

The dev script can be used to run your project in the localhost. The start script will be useful for GAE deployment later on. But essentially, you can use either to run your project locally.

To test that ts is working correctly, try some console.log commands in your index.ts and run `npm run dev`.

### 2. Connect to GAE

Download the [Cloud SDK](https://cloud.google.com/sdk/install) on your local machine. Then, setup a project on [Google Cloud Platform](https://console.cloud.google.com/).

To deploy your app on GAE, you will need an `app.yaml` and also to specify your Node version in the package.json.

`app.yaml`

```Yaml
# see https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml for more info

runtime: nodejs
env: flex
```

Add this in the package.json:

```Json
"scripts": {
		"start": "tsc && node ./dist/index.js",
    ...
		"deploy": "gcloud app deploy"
	},
...
"engines": {
		"node": "10.x.x"
	}
```

We will use node 10 to ensure compatibility with Firestore later.

Finally run `npm run deploy`.

### 3. Setup a simple GraphQL API connected to Firestore

Once you have gotten GAE up and running, we will setup Apollo Server and add some graphql APIs.

Install the following dependencies:

`yarn add graphql lodash @types/lodash express apollo-server-express apollo-server-core apollo-datasource`

`yarn add @types/express @types/graphql --dev`

`index.js` - We will setup an endpoint for GraphQL queries:

```Typescript
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

// Some fake data (to be removed in later section)
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

const resolvers = {
  Query: { books: () => books },
};

const server = new ApolloServer({ typeDef, resolvers })

const app: express.Application = express()
server.applyMiddleware({ app })

// Start the server
// process.env.PORT will be used by GAE
const port = process.env.PORT || 4000
app.listen({ port: port }, () =>
	console.log(`Server is ready at http://localhost:4000${server.graphqlPath}`)
)
```

At this point, we can run `npm run dev` and access the graphQL playground interface at the url above.

### 4. GraphQL Modularity and Schema design

As you can imagine, when your GraphQL application starts to grow, the complexity of the schema (typeDefs and resolver) will grow out of hand. To organise your code, it is ideal to split up schema types and their respective resolvers into different files [4].

Other interesting articles on how to design your graphql schema are listed in the references.

### 5. Connecting to Firestore

Install the following dependencies for Firestore-admin:

`yarn add firebase-admin firebase`

You can connect to firestore using:

```Typescript
import admin from 'firebase-admin'

let serviceAccountKey = require('../serviceAccountKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
})

const db = admin.firestore();
```

Now, we are done with the basic building block for our project using the different stack! Refer to here for the full code: https://github.com/Happytreat/graphql-ts-gae-boilerplate

### References

1. https://medium.com/google-cloud/apollo-graphql-server-on-google-app-engine-in-under-5-minutes-bbd64050e9ff

2. [Graphql server for express, connect, hapi, koa and more](https://github.com/apollographql/apollo-server)

3. [firestore | javascript sdk | firebase](https://firebase.google.com/docs/reference/js/firebase.firestore)

4. [Modularizing your graphql schema code](https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2)

5. [Graphql schema design: building evolvable schemas](https://www.apollographql.com/blog/graphql-schema-design-building-evolvable-schemas-1501f3c59ed5)
