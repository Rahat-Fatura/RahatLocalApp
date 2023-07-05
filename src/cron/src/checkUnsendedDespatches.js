let queryBuilder = require("../../builders/despatch/query");
const despatchJson = require("../../builders/despatch/json");
const movements = require("../../builders/movements");
const services = require("../../services");
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (app) => {
    if (app.get("checking_desp_is_running")) {
        // console.log("cron will not run :>>");
        return;
    } else {
        // console.log("cron will run :>>");
        app.set("checking_desp_is_running", true);
    }
    try {
        const db_type = config.get("local.type");
        let despatches = await queryBuilder.checkUnsended(db_type);
        console.log(
            `ERP kontrolü sonucu ${despatches.length} adet irsaliye bulundu!`
        );
        for await (desp of despatches) {
            let willSend = false;
            let ex_id_str = String(desp.external_id);
            let desps_in_db = await prisma.despatches.findMany({
                where: {
                    external_id: ex_id_str,
                },
            });
            // console.log(
            //     `${ex_id_str} ID'li faturanın geçmişte ${invs_in_db.length} adet faturası var!`
            // );
            if (!desps_in_db) {
                willSend = true;
            } else {
                let successfull = desps_in_db.filter(
                    (desp) => desp.status === 200
                );
                let failed = desps_in_db.length - successfull.length;
                // console.log(
                //     `${ex_id_str} ID'li faturanın geçmişte ${successfull.length} adet başarılı, ${failed} adet başarısız faturası var!`
                // );
                let tryCount = config.get(
                    "settings.checkUnsendedDespatch.failedTryCount"
                );
                if (successfull.length === 0 && failed <= tryCount) {
                    willSend = true;
                }
            }
            // console.log("willSend :>> ", willSend);
            if (willSend) {
                console.log(
                    `${ex_id_str} ID'li irsaliyenin tekrar gönderimi sağlanacak!`
                );
                let sendingRecord, json;
                try {
                    sendingRecord =
                        await movements.despatch.sending.createDespatchRecord({
                            ex_id: ex_id_str,
                            code: "0",
                            sending_type: "CHECKED",
                        });
                    json = await despatchJson.builder(ex_id_str);
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: ex_id_str,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 101,
                        status_desc:
                            "İrsaliye oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                        sending_type: "UPDATE",
                    });
                    await services.apiService.connect.despatch.updateDespatch(
                        json,
                        true
                    );
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: ex_id_str,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "İrsaliye başarıyla sisteme gönderildi!",
                        sending_type: "UPDATE",
                    });
                } catch (error) {
                    console.error("id: ", ex_id_str, " => error: ", error);
                    let updateSendingRecord =
                        await movements.despatch.sending.updateDespatchRecord({
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
        app.set("checking_desp_is_running", false);
    }
};
