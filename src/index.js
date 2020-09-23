// const { GraphQLServer } = require('graphql-yoga')
const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')

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
        ## Update a link    #practice
        # updateLink(id: ID!, url: String, description: String): Link
        ## Delete a link    #practice
        # deleteLink(id: ID!): Link 
    }
    type Link {
        id: ID!
        description: String!
        url: String!
    }
`

// let links = [{
//     id: 'link-0',
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL'
// }]
// let idCount = links.length

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        }
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
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
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    }
})
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

//server.start(() => console.log(`Server is running on http://localhost:4000`))