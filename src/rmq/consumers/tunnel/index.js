const connect = require("../connection");
const services = require("../../../services");
const builders = require("../../../builders/invoice/query");
const buildersDespatch = require("../../../builders/despatch/query");
const movements = require("../../../builders/movements");
const invoiceJson = require("../../../../src/builders/invoice/json");
const despatchJson = require("../../../../src/builders/despatch/json");
const config = require("config");

const consumeTunnel = async () => {
    const db_type = config.get("local.type");
    services.apiService.connect
        .rmq_code()
        .then((result) => {
            connect("localapp_coms")
                .then(async ([channel]) => {
                    let queue = `localApp.tunnel.${result.rmq_code}.edoc`;
                    await channel.assertQueue(queue, {
                        durable: true,
                    });
                    channel.consume(queue, async (data) => {
                        let msg = JSON.parse(data.content.toString());
                        console.log("msg :>> ", msg);
                        let move_log_id =
                            await movements.invoice.notify.createRMQRecord({
                                ex_id: msg.data.erpId,
                                code: "0",
                                updating_type: "NOTIFY",
                            });
                        if (msg.code == "invoice") {
                            if (msg.type == "status.update") {
                                await movements.invoice.notify.updateRMQRecord({
                                    id: move_log_id,
                                    ex_id: msg.data.erpId,
                                    code: msg.data.new.ref_no,
                                    json: JSON.stringify(msg),
                                    status: 200,
                                    status_desc: "Fatura güncelleme bildirimi!",
                                    updating_type: "NOTIFY.INV.UPD",
                                });
                                if (msg.data.edoc_status == 202) {
                                    builders
                                        .updInvNumFn(
                                            msg.data.erpId,
                                            msg.data.new.document_number,
                                            db_type
                                        )
                                        .then(async (result) => {
                                            await movements.invoice.notify.updateRMQRecord(
                                                {
                                                    id: move_log_id,
                                                    ex_id: msg.data.erpId,
                                                    code: msg.data.new.ref_no,
                                                    json: JSON.stringify(
                                                        result
                                                    ),
                                                    status: 200,
                                                    status_desc:
                                                        "Fatura numarası başarıyla güncellendi.",
                                                    updating_type:
                                                        "NOTIFY.INV.UPD",
                                                }
                                            );
                                        })
                                        .catch(async (err) => {
                                            await movements.invoice.notify.updateRMQRecord(
                                                {
                                                    id: move_log_id,
                                                    ex_id: msg.data.erpId,
                                                    code: msg.data.new.ref_no,
                                                    json: JSON.stringify(err),
                                                    status: 400,
                                                    status_desc:
                                                        "Fatura numarası güncellenirken hata oluştu!",
                                                    updating_type:
                                                        "NOTIFY.INV.UPD",
                                                }
                                            );
                                        });
                                }
                            } else if (msg.type == "data.refresh") {
                                await movements.invoice.notify.updateRMQRecord({
                                    id: move_log_id,
                                    ex_id: msg.data.erpId,
                                    code: msg.data.ref_no,
                                    json: JSON.stringify(msg),
                                    status: 200,
                                    status_desc: "Fatura yenileme bildirimi!",
                                    updating_type: "NOTIFY.INV.RFR",
                                });
                                let sendingRecord, json;
                                try {
                                    sendingRecord =
                                        await movements.invoice.sending.createInvoiceRecord(
                                            {
                                                ex_id: msg.data.erpId,
                                                code: "0",
                                                sending_type: "UPDATE",
                                            }
                                        );
                                    json = await invoiceJson.builder(
                                        msg.data.erpId
                                    );
                                    let updateSendingRecord =
                                        await movements.invoice.sending.updateInvoiceRecord(
                                            {
                                                id: sendingRecord,
                                                ex_id: msg.data.erpId,
                                                code: json.document.External
                                                    .RefNo,
                                                json: JSON.stringify(json),
                                                status: 101,
                                                status_desc:
                                                    "Fatura oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                                                sending_type: "UPDATE",
                                            }
                                        );
                                    services.apiService.connect.invoice
                                        .updateInvoice(json, true)
                                        .then(async (result) => {
                                            let updateSendingRecord =
                                                await movements.invoice.sending.updateInvoiceRecord(
                                                    {
                                                        id: sendingRecord,
                                                        ex_id: msg.data.erpId,
                                                        code: json.document
                                                            .External.RefNo,
                                                        json: JSON.stringify(
                                                            json
                                                        ),
                                                        status: 200,
                                                        status_desc:
                                                            "Fatura başarıyla sisteme gönderildi!",
                                                        sending_type: "UPDATE",
                                                    }
                                                );
                                        })
                                        .catch(async (error) => {
                                            console.error(
                                                "id: ",
                                                msg.data.erpId,
                                                " => error: ",
                                                error
                                            );
                                            let updateSendingRecord =
                                                await movements.invoice.sending.updateInvoiceRecord(
                                                    {
                                                        id: sendingRecord,
                                                        ex_id: msg.data.erpId,
                                                        code: json.document
                                                            .External.RefNo,
                                                        json: JSON.stringify(
                                                            json
                                                        ),
                                                        status: 400,
                                                        status_desc:
                                                            JSON.stringify(
                                                                error
                                                            ),
                                                        sending_type: "UPDATE",
                                                    }
                                                );
                                        });
                                } catch (error) {
                                    console.error(error);
                                    let updateSendingRecord =
                                        await movements.invoice.sending.updateInvoiceRecord(
                                            {
                                                id: sendingRecord,
                                                ex_id: msg.data.erpId,
                                                code: json?.document?.External
                                                    ?.RefNo,
                                                json: json
                                                    ? JSON.stringify(json)
                                                    : null,
                                                status: 400,
                                                status_desc:
                                                    JSON.stringify(error),
                                                sending_type: "UPDATE",
                                            }
                                        );
                                }
                            }
                        } else if (msg.code == "despatch") {
                            if (msg.type == "status.update") {
                                await movements.despatch.notify.updateRMQRecord({
                                    id: move_log_id,
                                    ex_id: msg.data.erpId,
                                    code: msg.data.new.ref_no,
                                    json: JSON.stringify(msg),
                                    status: 200,
                                    status_desc: "İrsaliye güncelleme bildirimi!",
                                    updating_type: "NOTIFY.DSP.UPD",
                                });
                                if (msg.data.edoc_status == 202) {
                                    buildersDespatch
                                        .updDespNumFn(
                                            msg.data.erpId,
                                            msg.data.new.document_number,
                                            db_type
                                        )
                                        .then(async (result) => {
                                            await movements.despatch.notify.updateRMQRecord(
                                                {
                                                    id: move_log_id,
                                                    ex_id: msg.data.erpId,
                                                    code: msg.data.new.ref_no,
                                                    json: JSON.stringify(
                                                        result
                                                    ),
                                                    status: 200,
                                                    status_desc:
                                                        "İrsaliye numarası başarıyla güncellendi.",
                                                    updating_type:
                                                        "NOTIFY.DSP.UPD",
                                                }
                                            );
                                        })
                                        .catch(async (err) => {
                                            await movements.despatch.notify.updateRMQRecord(
                                                {
                                                    id: move_log_id,
                                                    ex_id: msg.data.erpId,
                                                    code: msg.data.new.ref_no,
                                                    json: JSON.stringify(err),
                                                    status: 400,
                                                    status_desc:
                                                        "İrsaliye numarası güncellenirken hata oluştu!",
                                                    updating_type:
                                                        "NOTIFY.DSP.UPD",
                                                }
                                            );
                                        });
                                }
                            } else if (msg.type == "data.refresh") {
                                await movements.despatch.notify.updateRMQRecord({
                                    id: move_log_id,
                                    ex_id: msg.data.erpId,
                                    code: msg.data.ref_no,
                                    json: JSON.stringify(msg),
                                    status: 200,
                                    status_desc: "İrsaliye yenileme bildirimi!",
                                    updating_type: "NOTIFY.DSP.RFR",
                                });
                                let sendingRecord, json;
                                try {
                                    sendingRecord =
                                        await movements.despatch.sending.createDespatchRecord(
                                            {
                                                ex_id: msg.data.erpId,
                                                code: "0",
                                                sending_type: "UPDATE",
                                            }
                                        );
                                    json = await despatchJson.builder(
                                        msg.data.erpId
                                    );
                                    let updateSendingRecord =
                                        await movements.despatch.sending.updateDespatchRecord(
                                            {
                                                id: sendingRecord,
                                                ex_id: msg.data.erpId,
                                                code: json.document.External
                                                    .RefNo,
                                                json: JSON.stringify(json),
                                                status: 101,
                                                status_desc:
                                                    "İrsaliye oluşturuldu. Sisteme gönderilmeye hazırlanılıyor!",
                                                sending_type: "UPDATE",
                                            }
                                        );
                                    services.apiService.connect.despatch
                                        .updateDespatch(json, true)
                                        .then(async (result) => {
                                            let updateSendingRecord =
                                                await movements.despatch.sending.updateDespatchRecord(
                                                    {
                                                        id: sendingRecord,
                                                        ex_id: msg.data.erpId,
                                                        code: json.document
                                                            .External.RefNo,
                                                        json: JSON.stringify(
                                                            json
                                                        ),
                                                        status: 200,
                                                        status_desc:
                                                            "İrsaliye başarıyla sisteme gönderildi!",
                                                        sending_type: "UPDATE",
                                                    }
                                                );
                                        })
                                        .catch(async (error) => {
                                            console.error(
                                                "id: ",
                                                msg.data.erpId,
                                                " => error: ",
                                                error
                                            );
                                            let updateSendingRecord =
                                                await movements.despatch.sending.updateDespatchRecord(
                                                    {
                                                        id: sendingRecord,
                                                        ex_id: msg.data.erpId,
                                                        code: json.document
                                                            .External.RefNo,
                                                        json: JSON.stringify(
                                                            json
                                                        ),
                                                        status: 400,
                                                        status_desc:
                                                            JSON.stringify(
                                                                error
                                                            ),
                                                        sending_type: "UPDATE",
                                                    }
                                                );
                                        });
                                } catch (error) {
                                    console.error(error);
                                    let updateSendingRecord =
                                        await movements.despatch.sending.updateDespatchRecord(
                                            {
                                                id: sendingRecord,
                                                ex_id: msg.data.erpId,
                                                code: json?.document?.External
                                                    ?.RefNo,
                                                json: json
                                                    ? JSON.stringify(json)
                                                    : null,
                                                status: 400,
                                                status_desc:
                                                    JSON.stringify(error),
                                                sending_type: "UPDATE",
                                            }
                                        );
                                }
                            }
                        }
                        channel.ack(data);
                    });
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {});
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = {
    consumeTunnel,
};
