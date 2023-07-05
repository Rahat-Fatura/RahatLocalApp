const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let orderQueryObject = await prisma.despatchQueries.findFirst({});
            let orderQuery = orderQueryObject.order_query;
            if (orderQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(orderQuery)
                        .then((result) => {
                            resolve(result.recordset[0]);
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
