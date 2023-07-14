const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
    const invoice_query = await prisma.InvoiceQueries.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
        },
    });

    const despatch_query = await prisma.DespatchQueries.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
