const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let shipmentQueryObject = await prisma.despatchQueries.findFirst({});
            let shipmentDriverQuery = shipmentQueryObject.shipment_driver_query;
            if (shipmentDriverQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(shipmentDriverQuery)
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
