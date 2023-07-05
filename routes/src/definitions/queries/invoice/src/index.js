const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getQueriesInvoicePage = async (req, res) => {
    const queriesRecord = await prisma.invoiceQueries.findFirst({});
    return res.render("pages/queries/invoice", {
        page: {
            name: "queries-invoice",
            display: "Fatura SQL Sorguları",
            menu: "queries-invoice",
            uppermenu: "queries",
        },
        data: queriesRecord,
    });
};

const updateQueriesInvoice = async (req, res) => {
    try {
        const body = req.body;
        const update = await prisma.invoiceQueries.updateMany({
            data: {
                header_query: String(body.header.main),
                notes_query: String(body.header.notes),
                despatches_query: String(body.header.despatches),
                order_query: String(body.header.order),
                up_inv_num_query: String(body.header.update_number),
                check_unsended_invoices_query: String(
                    body.header.check_unsended
                ),
                customer_query: String(body.currents.customer),
                lines_query: String(body.lines.main),
            },
        });
        return res.send(true);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};

module.exports = {
    getQueriesInvoicePage,
    updateQueriesInvoice,
};
