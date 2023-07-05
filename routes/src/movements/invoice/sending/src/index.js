const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const date_time = require("date-and-time");

const getInvoiceSendingPage = async (req, res) => {
    const invoices = await prisma.invoices.findMany();
    // console.log(invoices)
    return res.render("pages/movements/invoiceSending", {
        page: {
            name: "movements-sending-invoice",
            display: "Fatura Gönderim Listesi",
            menu: "movements-sending-invoice",
            uppermenu: "movements-sending",
        },
        // data: invoices
    });
};

const getInvoiceSendingList = async (req, res) => {
    const draw = req.query.draw;
    const skip = req.query.start;
    const take = req.query.length;
    if (!req.query?.fdate || !req.query?.ldate) {
        return res.send({
            draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
        });
    }

    let whereClause = {
        updated_at: {
            lte: new Date(req.query.ldate),
            gte: new Date(req.query.fdate),
        },
    };
    if (req.query.searchbox) {
        whereClause["OR"] = [
            {
                external_id: {
                    contains: String(req.query.searchbox),
                    mode: "insensitive",
                },
            },
            {
                external_code: {
                    contains: String(req.query.searchbox),
                    mode: "insensitive",
                },
            },
            {
                status_desc: {
                    contains: String(req.query.searchbox),
                    mode: "insensitive",
                },
            },
            {
                json: {
                    contains: String(req.query.searchbox),
                    mode: "insensitive",
                },
            },
        ];
    }
    const recordsTotal = await prisma.invoices.count({
        where: {
            is_deleted: false,
        },
    });
    let recordsFiltered = recordsTotal;
    if (whereClause != {}) {
        recordsFiltered = await prisma.invoices.count({
            where: {
                is_deleted: false,
                ...whereClause,
            },
        });
    }

    prisma.invoices
        .findMany({
            where: {
                is_deleted: false,
                ...whereClause,
            },
            skip: Number(skip),
            take: Number(take),
            orderBy: {
                updated_at: "desc",
            },
        })
        .then(async (result) => {
            console.log(result);
            return res.send({
                draw,
                recordsTotal,
                recordsFiltered,
                data: result,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
};

module.exports = {
    getInvoiceSendingPage,
    getInvoiceSendingList,
};
