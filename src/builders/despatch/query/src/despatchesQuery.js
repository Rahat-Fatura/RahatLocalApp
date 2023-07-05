const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let despatchesQueryObject = await prisma.despatchQueries.findFirst({});
            let despatchesQuery = despatchesQueryObject.despatches_query;
            if (despatchesQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(despatchesQuery)
                        .then((result) => {
                            resolve(result.recordset);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            } else resolve({});
        } catch (error) {
            reject(error);
        }
    });
};
