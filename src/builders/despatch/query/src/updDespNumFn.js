const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, new_number, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queriesObject = await prisma.despatchQueries.findFirst({});
            let upd_query = queriesObject.up_desp_num_query;
            connect(db_type).then((connection) => {
                connection
                    .input("erpId", id)
                    .input("despNo", new_number)
                    .query(upd_query)
                    .then((result) => {
                        resolve(result.recordset);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        } catch (error) {
            reject(error);
        }
    });
};
