const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queriesObject = await prisma.despatchQueries.findFirst({});
            let customerQuery = queriesObject.customer_query;
            connect(db_type).then((connection) => {
                connection
                    .input("erpId", id)
                    .query(customerQuery)
                    .then((result) => {
                        resolve(result.recordset[0]);
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
