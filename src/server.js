#!/usr/bin/env nodejs

'use strict';

// const { GraphQLServer } = require('graphql-yoga')
const { ApolloServer, gql } = require('apollo-server')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const { PrismaClient } = require('@prisma/client')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const { PubSub } = require('graphql-yoga');
const pubsub = new PubSub()

// Prisma client
const prisma = new PrismaClient()

// Graphql type definition
const typeDefs = gql`
    type Query {
        info: String!
        feed(filter: String, skip: Int, take: Int, orderBy: LinkOrderByInput): Feed!
        # The start index is called skip
        # The limit is called take, meaning you’re “taking” x elements after a provided start index

        ## Fetch a single link by its 'id'
        link(id: ID!): Link
    }
    type Feed {
        links: [Link!]!
        count: Int!
    }
    input LinkOrderByInput {
        description: Sort
        url: Sort
        createdAt: Sort
    }
    enum Sort {
        asc
        desc
    }

    type Mutation {
        post(url: String!, description: String!): Link!
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        vote(linkId: ID!): Vote
        ## Update a link    #practice
        # updateLink(id: ID!, url: String, description: String): Link
        ## Delete a link    #practice
        deleteLink(id: ID!): Link
    }
    type Link {
        id: ID!
        description: String!
        url: String!
        postedBy: User
        votes: [Vote!]!
    }
    type AuthPayload{
        token: String
        user: User
    }
    type User {
        id: ID!
        name: String!
        email: String!
        links: [Link!]!
    }
    type Subscription {
        newLink: Link
        newVote: Vote
    }
    type Vote {
        id: ID!
        link: Link!
        user: User!
    }
`

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
}

const context = req => {
    return {
        ...req,
        prisma,
        pubsub
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
})


server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

//server.start(() => console.log(`Server is running on http://localhost:4000`))