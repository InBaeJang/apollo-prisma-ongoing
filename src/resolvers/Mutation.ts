// import { hash, compare } from 'bcryptjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils/utils'

async function signup(parent:any, args:any, context:any, info:any) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent:any, args:any, context:any, info:any) {
    const user = await context.prisma.user.findOne({ where: { email: args.email } })
    if (!user)
        throw new Error('No such user found')

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid)
        throw new Error('Invalid password')

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

function post(parent:any, args:any, context:any, info:any) {
    //// after subscription
    const userId = getUserId(context)

    const newLink = context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        }
    })
    context.pubsub.publish("NEW_LINK", newLink)

    return newLink

    //// before subscription
    // const userId = getUserId(context)

    // return context.prisma.link.create({
    //     data: {
    //         url: args.url,
    //         description: args.description,
    //         postedBy: { connect: { id: userId } },
    //     }
    // })
}

async function vote(parent:any, args:any, context:any, info:any) {
    const userId = getUserId(context)

    const vote = await context.prisma.vote.findOne({
        where: {
            linkId_userId: {
                linkId: Number(args.linkId),
                userId: userId
            }
        }
    })

    if (Boolean(vote)) {
        throw new Error(`Already voted for link: ${args.linkId}`)
    }

    const newVote = context.prisma.vote.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            link: {
                connect: {
                    id: Number(args.linkId)
                }
            },
        }
    })
    context.pubsub.publish("NEW_VOTE", newVote)
    return newVote
}

function deleteLink(parent:any, args:any, context:any, info:any) {
    return context.prisma.link.delete({
        where: { id: Number(args.id) }
    })
}

export default {
    signup,
    login,
    post,
    vote,
    deleteLink
}