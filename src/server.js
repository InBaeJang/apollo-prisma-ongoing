#!/usr/bin/env nodejs

'use strict'
import apolloServer from 'apollo-server'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import prismaClient from '@prisma/client'
import User from './resolvers/User.js'
import Link from './resolvers/Link.js'
import Subscription from './resolvers/Subscription.js'
import Vote from './resolvers/Vote.js'

const { ApolloServer, gql, PubSub } = apolloServer
const { PrismaClient } = prismaClient
const prisma = new PrismaClient()
const pubsub = new PubSub()

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
    scalar DateTime
    type Link {
        id: ID!
        description: String!
        createdAt: DateTime!
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
    context,
    introspection: true,
    playground: true
})


server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});