let queryBuilder = require("../../builders/invoice/query");
const invoiceJson = require("../../builders/invoice/json");
const movements = require("../../builders/movements/");
const services = require("../../services");
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (app) => {
    if (app.get("checking_inv_is_running")) {
        // console.log("cron will not run :>>");
        return;
    } else {
        // console.log("cron will run :>>");
        app.set("checking_inv_is_running", true);
    }
    try {
        const db_type = config.get("local.type");
        let invoices = await queryBuilder.checkUnsended(db_type);
        console.log(
            `ERP kontrolü sonucu ${invoices.length} adet fatura bulundu!`
        );
        for await (inv of invoices) {
            let willSend = false;
            let ex_id_str = String(inv.external_id);
            let invs_in_db = await prisma.invoices.findMany({
                where: {
                    external_id: ex_id_str,
                },
            });
            // console.log(
            //     `${ex_id_str} ID'li faturanın geçmişte ${invs_in_db.length} adet faturası var!`
            // );
            if (!invs_in_db) {
                willSend = true;
            } else {
                let successfull = invs_in_db.filter(
                    (inv) => inv.status === 200
                );
                let failed = invs_in_db.length - successfull.length;
                // console.log(
                //     `${ex_id_str} ID'li faturanın geçmişte ${successfull.length} adet başarılı, ${failed} adet başarısız faturası var!`
                // );
                let tryCount = config.get(
                    "settings.checkUnsendedInvoice.failedTryCount"
                );
                if (successfull.length === 0 && failed <= tryCount) {
                    willSend = true;
                }
            }
            // console.log("willSend :>> ", willSend);
            if (willSend) {
                console.log(
                    `${ex_id_str} ID'li faturanın tekrar gönderimi sağlanacak!`
                );
                let sendingRecord, json;
                try {
                    sendingRecord =
                        await movements.invoice.sending.createInvoiceRecord({
                            ex_id: ex_id_str,
                            code: "0",
                            sending_type: "CHECKED",
                        });
                    json = await invoiceJson.builder(ex_id_str);
                    await movements.invoice.sending.updateInvoiceRecord({
                        id: sendingRecord,
                        ex_id: ex_id_str,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 101,
                        status_desc:
                            "Fatura oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                        sending_type: "UPDATE",
                    });
                    await services.apiService.connect.invoice.updateInvoice(
                        json,
                        true
                    );
                    await movements.invoice.sending.updateInvoiceRecord({
                        id: sendingRecord,
                        ex_id: ex_id_str,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "Fatura başarıyla sisteme gönderildi!",
                        sending_type: "UPDATE",
                    });
                } catch (error) {
                    console.error("id: ", ex_id_str, " => error: ", error);
                    let updateSendingRecord =
                        await movements.invoice.sending.updateInvoiceRecord({
                            id: sendingRecord,
                            ex_id: ex_id_str,
                            code: json?.document?.External?.RefNo,
                            json: json ? JSON.stringify(json) : null,
                            status: 400,
                            status_desc: JSON.stringify(error),
                            sending_type: "UPDATE",
                        });
                }
            }
        }
    } catch (error) {
        console.log("error-xx :>> ", error);
    } finally {
        app.set("checking_inv_is_running", false);
    }
};
