const config = require("config");
const queryBuilder = require("../../../../../src/builders/despatch/query");
const despatchJson = require("../../../../../src/builders/despatch/json");
const services = require("../../../../../src/services");
const movements = require("../../../../../src/builders/movements");

const getDespatchPage = async (req, res) => {
    const db_type = config.get("local.type");
    let datetime = req.query?.datetime;
    let despatches = await queryBuilder.checkUnsended(db_type, datetime);
    // console.log("despatches :>> ", despatches);
    return res.render("pages/erp/despatch", {
        page: {
            name: "erp-despatch",
            display: "ERP İrsaliye Listesi",
            menu: "erp-despatch",
            uppermenu: "erp",
        },
        data: {
            despatches,
        },
    });
};

const sendManualDespatch = async (req, res) => {
    let sendingRecord, json;
    try {
        sendingRecord = await movements.despatch.sending.createDespatchRecord({
            ex_id: req.params.id,
            code: "0",
            sending_type: "UPDATE",
        });
        json = await despatchJson.builder(req.params.id);
        let updateSendingRecord =
            await movements.despatch.sending.updateDespatchRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: json.document.External.RefNo,
                json: JSON.stringify(json),
                status: 101,
                status_desc:
                    "İrsaliye oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                sending_type: "MANUAL",
            });
        services.apiService.connect.despatch
            .updateDespatch(json, true)
            .then(async (result) => {
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "İrsaliye başarıyla sisteme gönderildi!",
                        sending_type: "MANUAL",
                    });
                return res.status(200).send({
                    status: true,
                    message: "İrsaliye başarıyla sisteme gönderildi!",
                });
            })
            .catch(async (error) => {
                console.error("id: ", req.params.id, " => error: ", error);
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 400,
                        status_desc: JSON.stringify(error),
                        sending_type: "MANUAL",
                    });
                return res.status(400).send({
                    status: true,
                    error,
                });
            });
    } catch (error) {
        console.error(error);
        let updateSendingRecord =
            await movements.despatch.sending.updateDespatchRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: json?.document?.External?.RefNo,
                json: json ? JSON.stringify(json) : null,
                status: 400,
                status_desc: JSON.stringify(error),
                sending_type: "UPDATE",
            });
        return res.status(400).send({
            status: true,
            error,
        });
    }
};

module.exports = {
    getDespatchPage,
    sendManualDespatch,
};
