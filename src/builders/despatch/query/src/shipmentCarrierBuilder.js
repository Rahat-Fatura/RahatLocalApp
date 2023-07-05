const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let shipmentQueryObject = await prisma.despatchQueries.findFirst({});
            let shipmentCarrierQuery = shipmentQueryObject.shipment_carrier_query;
            if (shipmentCarrierQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(shipmentCarrierQuery)
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
