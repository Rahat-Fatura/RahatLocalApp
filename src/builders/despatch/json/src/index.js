const config = require("config");
const date_time = require("date-and-time");
const queryBuilder = require("../../query");
const { Queue } = require("../../../fifoClass");

async function delay(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    // console.warn("waited for :", ms, " ms");
}

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let fifo = new Queue(config.get("settings.queueLength"));
            let resultJson;
            let err_text;
            for (let i = 0; i < config.get("settings.numberOfRetries"); i++) {
                const db_type = config.get("local.type");
                let header = await queryBuilder.headerBuilder(id, db_type);
                if (!header) {
                    err_text = "İrsaliye belirtilen SQL ile bulunamadı!";
                    break;
                }
                let notes = await queryBuilder.notesBuilder(id, db_type);
                let lines = await queryBuilder.linesBuilder(id, db_type);
                // console.log(lines);
                let customer = await queryBuilder.customerBuilder(id, db_type);

                // let despatches = await queryBuilder.despatchesBuilder(
                //     id,
                //     db_type
                // );
                let order = await queryBuilder.orderBuilder(id, db_type);
                let shipment_driver = await queryBuilder.shipmentDriverBuilder(
                    id,
                    db_type
                );
                let shipment_carrier =
                    await queryBuilder.shipmentCarrierBuilder(id, db_type);
                let shipment_delivery =
                    await queryBuilder.shipmentDeliveryBuilder(id, db_type);

                let shipment_carier_object = {};
                if (shipment_carrier?.TaxNumber) {
                    shipment_carier_object = {
                        Carrier: shipment_carrier,
                    };
                }

                let shipment_driver_object = {};
                if (shipment_driver?.Name) {
                    shipment_driver_object = {
                        Driver: shipment_driver,
                    };
                }

                let shipment_delivery_object = {};
                if (shipment_delivery?.Address) {
                    shipment_delivery_object = {
                        Delivery: {
                            Address: shipment_delivery,
                        },
                    };
                }

                let shipment_object = {};
                if (
                    shipment_delivery_object ||
                    shipment_driver_object ||
                    shipment_carier_object
                ) {
                    shipment_object = {
                        Shipment: {
                            ...shipment_carier_object,
                            ...shipment_driver_object,
                            ...shipment_delivery_object,
                        },
                    };
                }
                // lines = lines.map((line) => {
                //     return {
                //         Name: line.Name,
                //         Quantity: line.Quantity,
                //         UnitCode: line.UnitCode,
                //         Price: line.Price,
                //     };
                // });

                let type = {};
                header.Type
                    ? (type = {
                          Type: header.Type,
                      })
                    : null;
                let profile = {};
                header.Profile
                    ? (profile = {
                          Profile: header.Profile,
                      })
                    : null;

                // let despatchesObject = {};
                // if (despatches?.Value) {
                //     despatchesObject = { Despatches: despatches };
                // }

                let orderObject = {};
                if (order?.Value) {
                    orderObject = { Order: order };
                }
                let json = {
                    integrator: config.get("integrator.name"),
                    document: {
                        External: {
                            ID: header.external_id,
                            RefNo: header.external_refno,
                            Type: header.external_type,
                        },
                        IssueDateTime: date_time.format(
                            header.IssueDateTime,
                            "YYYY-MM-DDTHH:mm:ss",
                            true
                        ),
                        // ...despatchesObject,
                        ...orderObject,
                        ...type,
                        ...profile,
                        Notes: notes,
                        Customer: customer,
                        ...shipment_object,
                        Lines: lines,
                    },
                };
                fifo.push(json);
                // console.log(fifo.elements);
                if (await fifo.isValid()) {
                    resultJson = fifo.elements[0];
                    break;
                } else {
                    await delay(config.get("settings.queueCreatorWaitingMs"));
                }
            }

            if (!resultJson) {
                return reject(err_text ? err_text : "İrsaliye doğrulanamadı!");
            }

            resolve(resultJson);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
