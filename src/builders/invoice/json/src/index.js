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
            let fifo = new Queue(config.get("setting.queueLength"));
            let resultJson;
            let err_text;
            for (let i = 0; i < config.get("setting.numberOfRetries"); i++) {
                const db_type = config.get("local.type");
                let header = await queryBuilder.headerBuilder(id, db_type);
                if (!header) {
                    err_text = "Fatura belirtilen SQL ile bulunamadı!";
                    break;
                }
                let lines = await queryBuilder.linesBuilder(id, db_type);
                let customer = await queryBuilder.customerBuilder(id, db_type);
                lines = lines.map((line) => {
                    let allowance = {};
                    let withholding = {};
                    line.AllowancePercent
                        ? (allowance = {
                              Allowance: {
                                  Percent: line.AllowancePercent,
                              },
                          })
                        : null;
                    line.WithholdingTaxCode
                        ? (withholding = {
                              WithholdingTax: {
                                  Code: line.WithholdingTaxCode,
                              },
                          })
                        : null;
                    return {
                        Name: line.Name,
                        Quantity: line.Quantity,
                        UnitCode: line.UnitCode,
                        Price: line.Price,
                        KDV: {
                            Percent: line.KDVPercent,
                        },
                        ...allowance,
                        ...withholding,
                    };
                });
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
                        Type: header.Type,
                        Customer: customer,
                        Lines: lines,
                    },
                };
                fifo.push(json);
                // console.log(fifo.elements);
                if (await fifo.isValid()) {
                    resultJson = fifo.elements[0];
                    break;
                } else {
                    await delay(config.get("setting.queueCreatorWaitingMs"));
                }
            }

            if (!resultJson) {
                return reject(err_text ? err_text : "Fatura doğrulanamadı!");
            }

            resolve(resultJson);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
