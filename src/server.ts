#!/usr/bin/env nodejs

'use strict'
import { ApolloServer } from 'apollo-server';
import schema from './schema/schema';
import depthLimit from 'graphql-depth-limit';
import { createContext } from './schema/context'

const port = 4000

const server = new ApolloServer({
    schema,
    context:({ req }) => ({
        headers: req.headers,
        ...createContext(),
    }),
    playground: {
        endpoint: '/playground',
    },
    validationRules: [depthLimit(7)],
    introspection: true,
})

server.listen({ port: port }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});


// "dev": "ts-node src/server.ts", // without nodemon
// "build": "tsc -p . && ncp src/schema dist/schema",