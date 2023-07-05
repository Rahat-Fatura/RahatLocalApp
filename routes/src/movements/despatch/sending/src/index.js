const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const date_time = require("date-and-time");

const getDespatchSendingPage = async (req, res) => {
    return res.render("pages/movements/despatchSending", {
        page: {
            name: "movements-sending-despatch",
            display: "İrsaliye Gönderim Listesi",
            menu: "movements-sending-despatch",
            uppermenu: "movements-sending",
        },
    });
};

const getDespatchSendingList = async (req, res) => {
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
    const recordsTotal = await prisma.despatches.count({
        where: {
            is_deleted: false,
        },
    });
    let recordsFiltered = recordsTotal;
    if (whereClause != {}) {
        recordsFiltered = await prisma.despatches.count({
            where: {
                is_deleted: false,
                ...whereClause,
            },
        });
    }

    prisma.despatches
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
    getDespatchSendingPage,
    getDespatchSendingList,
};
