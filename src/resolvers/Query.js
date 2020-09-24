

function info(parent, arges, context, info) {
    return "This is the API of a Hackernews Clone"
}

function feed(parent, args, context, info) {
    return context.prisma.link.findMany()
}

module.exports = {
    info,
    feed,
}