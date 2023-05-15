const config = require("config");
const queryBuilder = require("../../../../src/builders/invoice/query");
const invoiceJson = require("../../../../src/builders/invoice/json");
const services = require("../../../../src/services");
const movements = require("../../../../src/builders/movements");

const getInvoicePage = async (req, res) => {
    const db_type = config.get("local.type");
    let datetime = req.query?.datetime;
    let invoices = await queryBuilder.checkUnsended(db_type, datetime);
    // console.log("invoices :>> ", invoices);
    return res.render("pages/erp/invoice", {
        page: {
            name: "erp-invoice",
            display: "ERP Fatura Listesi",
            menu: "erp-invoice",
            uppermenu: "erp",
        },
        data: {
            invoices,
        },
    });
};

const sendManualInvoice = async (req, res) => {
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
                sending_type: "MANUAL",
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
                        sending_type: "MANUAL",
                    });
                return res.status(200).send({
                    status: true,
                    message: "Fatura başarıyla sisteme gönderildi!",
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
            await movements.invoice.sending.updateInvoiceRecord({
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
    getInvoicePage,
    sendManualInvoice,
};
