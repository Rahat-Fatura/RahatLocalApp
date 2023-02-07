const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createRMQRecord = async (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const invoice = await prisma.invoices.create({
                data: {
                    external_id: body.ex_id,
                    external_code: body.code,
                    json: null,
                    status: 100,
                    status_desc:
                        "Notify bildirimi geldi. İşleme hazırlanılıyor!",
                    sending_type: body.updating_type,
                },
            });
            resolve(invoice.id);
        } catch (error) {
            reject(error);
        }
    });
};

const updateRMQRecord = async (body) => {
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
                    sending_type: body.updating_type,
                },
            });
            resolve(invoice.id);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createRMQRecord,
    updateRMQRecord,
};
