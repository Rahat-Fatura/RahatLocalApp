const { PrismaClient } = require("@prisma/client");
const { reject } = require("lodash");
const prisma = new PrismaClient();

const createInvoiceRecord = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const invoice = await prisma.invoices.create({
                data: {
                    external_id: body.ex_id,
                    external_code: body.code,
                    json: null,
                    status: 100,
                    status_desc:
                        "Fatura kaydı bildirimi geldi. Fatura hazırlanıyor!",
                    sending_type: body.sending_type,
                },
            });
            resolve(invoice.id);
        } catch (error) {
            reject(error);
        }
    });
};

const updateInvoiceRecord = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const invoice = await prisma.invoices.updateMany({
                where: {
                    id: body.id,
                },
                data: {
                    external_id: body.ex_id,
                    external_code: body.code,
                    json: body.json,
                    status: body.status,
                    status_desc: body.status_desc,
                    sending_type: body.sending_type,
                },
            });
            resolve(invoice.id);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createInvoiceRecord,
    updateInvoiceRecord,
};
