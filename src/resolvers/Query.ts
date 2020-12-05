

function info(parent:any, args:any, context:any, info:any) {
    return "This is the API of a Hackernews Clone"
}

async function feed(parent:any, args:any, context:any, info:any) {
    const where = args.filter ? {
        OR: [
            { description: { contains: args.filter } },
            { url: { contains: args.filter } },
        ],
    } : {}

    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
    })
    const count = await context.prisma.link.count({
        where
    })

    return {
        links,
        count,
    }
}

async function link(parent:any, args:any, context:any, info:any) {
    const oneLink = await context.prisma.link.findOne({
        where: { id: Number(args.id) }
    })
    return oneLink
}

export default {
    info,
    feed,
    link
}