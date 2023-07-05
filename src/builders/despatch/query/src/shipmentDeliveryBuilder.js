const connect = require("../../../../local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (id, db_type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let shipmentQueryObject = await prisma.despatchQueries.findFirst({});
            let shipmentDeliveryQuery = shipmentQueryObject.shipment_delivery_query;
            if (shipmentDeliveryQuery) {
                connect(db_type).then((connection) => {
                    connection
                        .input("erpId", id)
                        .query(shipmentDeliveryQuery)
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
