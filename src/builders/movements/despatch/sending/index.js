const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDespatchRecord = async (body) => {
    console.log(body);
    return new Promise(async (resolve, reject) => {
        try {
            const despatch = await prisma.despatches.create({
                data: {
                    external_id: body.ex_id,
                    external_code: body.code,
                    json: null,
                    status: 100,
                    status_desc:
                        "İrsaliye kaydı bildirimi geldi. İrsaliye hazırlanıyor!",
                    sending_type: body.sending_type,
                },
            });
            console.log("despatch.id :>> ", despatch.id);
            resolve(despatch.id);
        } catch (error) {
            reject(error);
        }
    });
};

const updateDespatchRecord = async (body) => {
    // console.log(body);
    return new Promise(async (resolve, reject) => {
        try {
            const despatch = await prisma.despatches.updateMany({
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
            resolve(despatch.id);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createDespatchRecord,
    updateDespatchRecord,
};
