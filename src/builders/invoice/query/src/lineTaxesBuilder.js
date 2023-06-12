const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lineTaxesQueryObject = await prisma.invoiceQueries.findFirst({});
            let lineTaxesQuery = lineTaxesQueryObject.lines_taxes_query;
            if (lineTaxesQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("lineId", id)
                        .query(lineTaxesQuery)
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
