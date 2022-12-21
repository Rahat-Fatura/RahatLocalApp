const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queriesObject = await prisma.invoiceQueries.findFirst({});
            let linesQuery = queriesObject.lines_query;
            connect(db_type).then((connection) => {
                connection
                    .input("erpId", id)
                    .query(linesQuery)
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
