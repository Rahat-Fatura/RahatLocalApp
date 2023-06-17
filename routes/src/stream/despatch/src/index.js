const despatchJson = require("../../../../../src/builders/despatch/json");
const services = require("../../../../../src/services");
const movements = require("../../../../../src/builders/movements");

const insertDespatch = async (req, res) => {
    res.send(true);
    let sendingRecord, json;
    try {
        sendingRecord = await movements.despatch.sending.createDespatchRecord({
            ex_id: req.params.id,
            code: "0",
            sending_type: "INSERT",
        });
        json = await despatchJson.builder(req.params.id);
        console.log("json :>> ", json);
        let updateSendingRecord =
            await movements.despatch.sending.updateDespatchRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: json.document.External.RefNo,
                json: JSON.stringify(json),
                status: 101,
                status_desc:
                    "İrsaliye oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                sending_type: "INSERT",
            });
        services.apiService.connect.despatch
            .insertDespatch(json, true)
            .then(async (result) => {
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "İrsaliye başarıyla sisteme gönderildi!",
                        sending_type: "INSERT",
                    });
            })
            .catch(async (error) => {
                console.error("BURDA id: ", req.params.id, " => error: ", error);
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 400,
                        status_desc: JSON.stringify(error),
                        sending_type: "INSERT",
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
                sending_type: "INSERT",
            });
    }
};

const updateDespatch = async (req, res) => {
    res.send(true);
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
                sending_type: "UPDATE",
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
                        sending_type: "UPDATE",
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
                        sending_type: "UPDATE",
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
    }
};

const deleteDespatch = async (req, res) => {
    res.send(true);
    let sendingRecord;
    try {
        sendingRecord = await movements.despatch.sending.createDespatchRecord({
            ex_id: req.params.id,
            code: "0",
            sending_type: "DELETE",
        });
        services.apiService.connect.despatch
            .deleteDespatch(req.params.id, true)
            .then(async (result) => {
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: "0",
                        json: null,
                        status: 200,
                        status_desc:
                            "İrsaliye silme bildirimi başarıyla sisteme gönderildi!",
                        sending_type: "DELETE",
                    });
            })
            .catch(async (error) => {
                console.error("id: ", req.params.id, " => error: ", error);
                let updateSendingRecord =
                    await movements.despatch.sending.updateDespatchRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: "0",
                        json: null,
                        status: 400,
                        status_desc: JSON.stringify(error),
                        sending_type: "DELETE",
                    });
            });
    } catch (error) {
        console.error(error);
        let updateSendingRecord =
            await movements.despatch.sending.updateDespatchRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: "0",
                json: null,
                status: 400,
                status_desc: JSON.stringify(error),
                sending_type: "DELETE",
            });
    }
};

module.exports = {
    insertDespatch,
    updateDespatch,
    deleteDespatch,
};
