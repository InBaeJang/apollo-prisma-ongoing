'use strict';

// const { GraphQLServer } = require('graphql-yoga')
const { ApolloServer, gql } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
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
        feed: [Link!]!
        ## Fetch a single link by its 'id'  #practice
        # link(id: ID!): Link
    }
    type Mutation {
        post(url: String!, description: String!): Link!
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        vote(linkId: ID!): Vote
        ## Update a link    #practice
        # updateLink(id: ID!, url: String, description: String): Link
        ## Delete a link    #practice
        # deleteLink(id: ID!): Link
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

// let links = [{
//     id: 'link-0',
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL'
// }]
// let idCount = links.length

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
    // Query: {
    //     info: () => `This is the API of a Hackernews Clone`,
    //     feed: async (parent, args, context) => {
    //         return context.prisma.link.findMany()
    //     }
    // },
    // Mutation: {
    //     post: (parent, args, context, info) => {
    //         const newLink = context.prisma.link.create({
    //             data: {
    //                 url: args.url,
    //                 description: args.description,
    //             },
    //         })
    //         return newLink
    //     },
    // 2
    // post: (parent, args) => {
    //     const link = {
    //         id: `link-${idCount++}`,
    //         description: args.description,
    //         url: args.url,
    //     }
    //     links.push(link)
    //     return link
    // }
    // },
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