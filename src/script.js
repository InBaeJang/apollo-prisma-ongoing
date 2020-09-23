// 프리즈마 연습용

// 1
const { PrismaClient } = require("@prisma/client")

// 2
const prisma = new PrismaClient()

//3
async function main() {
    const deleteLink = await prisma.link.delete({
        where: {
            id: 2
        }
    })
    // const newLink = await prisma.link.create({
    //     data: {
    //         url: "www.prisma.io",
    //         description: "Prisma replaces traditional ORMs"
    //     },
    // })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

//4
main()
    .catch(e => {
        throw e
    })
    // 5
    .finally(async () => {
        await prisma.disconnect()
    })