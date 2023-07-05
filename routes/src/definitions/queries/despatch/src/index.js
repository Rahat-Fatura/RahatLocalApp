const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getQueriesDespatchPage = async (req, res) => {
    const queriesRecord = await prisma.despatchQueries.findFirst({});
    console.log(queriesRecord);
    return res.render("pages/queries/despatch", {
        page: {
            name: "queries-despatch",
            display: "İrsaliye SQL Sorguları",
            menu: "queries-despatch",
            uppermenu: "queries",
        },
        data: queriesRecord,
    });
};

const updateQueriesDespatch = async (req, res) => {
    try {
        const body = req.body;
        // console.log(String(body.header.update_number));
        const update = await prisma.despatchQueries.updateMany({
            data: {
                header_query: String(body.header.main),
                notes_query: String(body.header.notes),
                despatches_query: String(body.header.despatches),
                order_query: String(body.header.order),
                up_desp_num_query: String(body.header.update_number),
                check_unsended_despatches_query: String(
                    body.header.check_unsended
                ),
                customer_query: String(body.currents.customer),
                lines_query: String(body.lines.main),
                shipment_driver_query: String(body.shipment_driver_query.main),
                shipment_carrier_query: String(body.shipment_carrier_query.main),
                shipment_delivery_query: String(body.shipment_delivery_query.main),
            },
        });
        return res.send(true);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};

module.exports = {
    getQueriesDespatchPage,
    updateQueriesDespatch,
};
