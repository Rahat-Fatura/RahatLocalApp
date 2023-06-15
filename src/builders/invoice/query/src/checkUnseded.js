const connect = require("../../../../local");
const config = require("config");
const date_time = require("date-and-time");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (db_type, dt) => {
    return new Promise(async (resolve, reject) => {
        try {
            let queriesObject = await prisma.invoiceQueries.findFirst({});
            let checkUnsendedQuery =
                queriesObject.check_unsended_invoices_query;
            let d = dt
                ? dt
                : new Date() -
                  1000 *
                      60 *
                      60 *
                      24 *
                      Number(
                          config.get("settings.checkUnsendedInvoice.daysAgo")
                      );
            // let dateTime = d.setDate(
            //     d.getDate() -
            //         Number(config.get("settings.checkUnsendedInvoice.daysAgo"))
            // );
            // console.log("dateTime1 :>> ", dateTime);
            let dateTime = date_time.format(
                new Date(d),
                config.get("settings.checkUnsendedInvoice.dateFormat"),
                true
            );
            console.log("dateTime :>> ", dateTime);
            connect(db_type).then((connection) => {
                connection
                    .input("dateTime", dateTime)
                    .query(checkUnsendedQuery)
                    .then((result) => {
                        resolve(result.recordset);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
