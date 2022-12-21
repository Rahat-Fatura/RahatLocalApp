const invoiceJson = require("../../../../../src/builders/invoice/json");
const services = require("../../../../../src/services");
const movements = require("../../../../../src/builders/movements");

const insertInvoice = async (req, res) => {
    res.send(true);
    let sendingRecord, json;
    try {
        sendingRecord = await movements.invoice.sending.createInvoiceRecord({
            ex_id: req.params.id,
            code: "0",
            sending_type: "INSERT",
        });
        json = await invoiceJson.builder(req.params.id);
        let updateSendingRecord =
            await movements.invoice.sending.updateInvoiceRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: json.document.External.RefNo,
                json: JSON.stringify(json),
                status: 101,
                status_desc:
                    "Fatura oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                sending_type: "INSERT",
            });
        services.apiService.connect.invoice
            .insertInvoice(json, true)
            .then(async (result) => {
                let updateSendingRecord =
                    await movements.invoice.sending.updateInvoiceRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "Fatura başarıyla sisteme gönderildi!",
                        sending_type: "INSERT",
                    });
            })
            .catch(async (error) => {
                console.error("id: ", req.params.id, " => error: ", error);
                let updateSendingRecord =
                    await movements.invoice.sending.updateInvoiceRecord({
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
            await movements.invoice.sending.updateInvoiceRecord({
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

const updateInvoice = async (req, res) => {
    res.send(true);
    let sendingRecord, json;
    try {
        sendingRecord = await movements.invoice.sending.createInvoiceRecord({
            ex_id: req.params.id,
            code: "0",
            sending_type: "UPDATE",
        });
        json = await invoiceJson.builder(req.params.id);
        let updateSendingRecord =
            await movements.invoice.sending.updateInvoiceRecord({
                id: sendingRecord,
                ex_id: req.params.id,
                code: json.document.External.RefNo,
                json: JSON.stringify(json),
                status: 101,
                status_desc:
                    "Fatura oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                sending_type: "UPDATE",
            });
        services.apiService.connect.invoice
            .updateInvoice(json, true)
            .then(async (result) => {
                let updateSendingRecord =
                    await movements.invoice.sending.updateInvoiceRecord({
                        id: sendingRecord,
                        ex_id: req.params.id,
                        code: json.document.External.RefNo,
                        json: JSON.stringify(json),
                        status: 200,
                        status_desc: "Fatura başarıyla sisteme gönderildi!",
                        sending_type: "UPDATE",
                    });
            })
            .catch(async (error) => {
                console.error("id: ", req.params.id, " => error: ", error);
                let updateSendingRecord =
                    await movements.invoice.sending.updateInvoiceRecord({
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
            await movements.invoice.sending.updateInvoiceRecord({
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

module.exports = {
    insertInvoice,
    updateInvoice,
};
