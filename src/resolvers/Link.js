function postedBy(parent, args, context) {
    return context.prisma.link.findOne({
        where: {
            id: parent.id
        }
    }).postedBy()
}

function votes(parent, args, context) {
    return context.prisma.link.findOne({
        where: {
            id: parent.id
        }
    }).votes()
}

export default {
    postedBy,
    votes
}

// module.exports = {
//     postedBy,
//     votes
// }