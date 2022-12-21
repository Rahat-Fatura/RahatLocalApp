$(document).ready(function () {
    const invoice_table = $("#invoices").DataTable({
        language: {
            url: "/vendor/libs/datatables/language/dataTables.tr.json",
        },
        serverSide: true,
        processing: true,
        ajax: {
            url: "/datatablesQuery/invoices/waiting",
            data: (d) => {
                return $.extend({}, d, {
                    searchbox: $("#searchbox").val(),
                    fdate: fdateObject.formatDate(
                        fdateObject.selectedDates[0],
                        "Y-m-d"
                    ),
                    ldate: ldateObject.formatDate(
                        ldateObject.selectedDates[0],
                        "Y-m-d"
                    ),
                });
            },
        },
        columns: [
            { data: "id" },
            { data: "erp_no" },
            { data: "receiver_name" },
            { data: "receiver_tax" },
            { data: "invoice_date" },
            { data: "invoice_payable" },
            { data: "currency_code" },
            { data: "invoice_profile" },
            { data: "invoice_type" },
            { data: "process" },
        ],
        columnDefs: [
            {
                // For Checkboxes
                targets: 0,
                searchable: false,
                orderable: false,
                render: function () {
                    return '<input type="checkbox" class="dt-checkboxes form-check-input">';
                },
                checkboxes: {
                    selectRow: true,
                    selectAllRender:
                        '<input type="checkbox" class="form-check-input">',
                },
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `${
                        String(data).length > 25
                            ? String(data).substring(0, 25) + "..."
                            : String(data)
                    }<br>${row["receiver_tax"]}`;
                },
            },
            {
                targets: 4,
                orderable: false,
                render: (data, type, row) => {
                    return `${data}<br>${Number(row["invoice_payable"]).toFixed(
                        2
                    )} ${row["currency_code"]}`;
                },
            },
            {
                targets: 7,
                orderable: false,
                render: (data, types, row) => {
                    let profile = "";
                    let type = "";
                    switch (data) {
                        case "TICARIFATURA":
                            profile = "success";
                            break;
                        case "TEMELFATURA":
                            profile = "info";
                            break;
                        case "EARSIVFATURA":
                            profile = "warning";
                            break;
                        default:
                            profile = "secondary";
                            break;
                    }
                    switch (row["invoice_type"]) {
                        case "SATIS":
                            type = "warning";
                            break;
                        case "IADE":
                            type = "info";
                            break;
                        case "ISTISNA":
                            type = "primary";
                            break;
                        default:
                            type = "secondary";
                            break;
                    }
                    return `
                    <span class="badge bg-${profile} bg-glow d-block">${data}</span>
                    <span class="badge bg-label-${type} d-block mt-1">${row["invoice_type"]}</span>`;
                },
            },
            {
                targets: 9,
                className: "dt-right",
                width: "10px",
                orderable: false,
                render: (data, type, row) => {
                    return `<div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-icon btn-label-warning waves-effect" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" style="">
                                    <li><a class="dropdown-item" href="#">
                                        <i class="fa-regular fa-pen-to-square fa-sm"></i> Düzenle</a>
                                    </li>
                                    <li><a class="dropdown-item" href="#">
                                        <i class="fa-solid fa-retweet fa-sm"></i> Sıfırla/Yenile </a>
                                    </li>
                                    <li><a class="dropdown-item" href="#">
                                        <i class="fa-regular fa-square-check fa-sm"></i> Gönderilmiş İşaretle</a>
                                    </li>
                                </ul>
                                <button id="preview-invoice" type="button" class="btn  btn-icon btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                                <button id="send-invoice" type="button" class="btn btn-icon btn-success waves-effect waves-light">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>`;
                },
            },
            {
                targets: [3, 5, 6, 8],
                visible: false,
            },
        ],
        order: [[1, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p><"col-sm-12 col-md-6"l>>',
        select: {
            // Select style
            style: "multi",
            selector:
                "tr>td:nth-child(1), tr>td:nth-child(2), tr>td:nth-child(3), tr>td:nth-child(4), tr>td:nth-child(5)",
        },
    });

    const searchTable = () => {
        invoice_table.draw();
    };

    let ldate = new Date();
    let fdate = new Date();
    fdate = fdate.setDate(ldate.getDate() - 7);
    let fdateObject = $("#fdate").flatpickr({
        locale: "tr",
        defaultDate: fdate,
        dateFormat: "d.m.Y",
        onChange: function (selectedDates, dateStr, instance) {
            searchTable();
        },
    });
    let ldateObject = $("#ldate").flatpickr({
        locale: "tr",
        defaultDate: ldate,
        dateFormat: "d.m.Y",
        onChange: function (selectedDates, dateStr, instance) {
            searchTable();
        },
    });

    $("#search-button").click((e) => {
        searchTable();
    });
    $("#searchbox").on("focusout", (e) => {
        searchTable();
    });
    $("#searchbox").keypress(function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == "13") {
            searchTable();
        }
    });

    $("#invoices tbody").on("click", "#preview-invoice", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
        $("#invoiceFrame").attr("src", "");
        let xml;
        let xslt;
        $.when(
            $.ajax({
                // First Request
                url: `/invoices/waiting/${data.id}/xml`,
                type: "get",
                success: function (xmls) {
                    xml = xmls;
                },
            }),
            $.ajax({
                // First Request
                url: `/invoices/waiting/${data.id}/xslt`,
                type: "get",
                success: function (xslts) {
                    xslt = xslts;
                },
            })
        )
            .then(function () {
                try {
                    let parser = new DOMParser();
                    let xmlDoc, xslDoc;
                    if (typeof xml == "string") {
                        xmlDoc = parser.parseFromString(xml, "application/xml");
                    } else {
                        xmlDoc = xml;
                    }

                    if (typeof xslt == "string") {
                        xslDoc = parser.parseFromString(
                            xslt,
                            "application/xml"
                        );
                    } else {
                        xslDoc = xslt;
                    }
                    let processor = new XSLTProcessor();
                    processor.importStylesheet(xslDoc);
                    let result = processor.transformToDocument(xmlDoc);
                    var blob = new Blob(
                        [
                            new XMLSerializer().serializeToString(
                                result.doctype
                            ),
                            result.documentElement.innerHTML,
                        ],
                        {
                            type: "text/html",
                        }
                    );
                    $("#invoiceFrame").attr("src", URL.createObjectURL(blob));
                } catch (error) {
                    console.error(error);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

    $("#iframe-print").on("click", function () {
        let myIframe = document.getElementById("invoiceFrame").contentWindow;
        myIframe.focus();
        myIframe.print();

        return false;
    });

    $("#invoices tbody").on("click", "#send-invoice", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
        sendSingleSelected(data);
    });

    $("#send-selected").click((e) => {
        let clicked = invoice_table.column(0).checkboxes.selected();
        if (!clicked.length) {
            toastr["error"](`En az 1 adet fatura seçmelisiniz!`, "Uyarı", {
                closeButton: true,
                tapToDismiss: false,
                progressBar: true,
            });
            return;
        }
        if (clicked.length > 1) {
            Swal.fire({
                icon: "question",
                title: "Emin misiniz?",
                text: `${clicked.length} adet faturayı göndermek istediğinize emin misiniz?`,
                showConfirmButton: true,
                confirmButtonText: "Evet, gönder",
                showCancelButton: true,
                cancelButtonText: "Hayır, gönderme",
                confirmButtonColor: "#59c9a5",
                cancelButtonColor: "#f67e7d",
            }).then((result) => {
                if (result.isConfirmed) {
                    sendMultipleSelected(clicked);
                }
            });
        } else {
            sendSingleSelected(clicked[0]);
        }
    });

    const sendMultipleSelected = (clicked) => {
        let cancelled = false;
        const requests = [];
        Swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonText: "Durdur",
            html: `
                    <h4>Faturalar gönderiliyor...</h4>
                    <blockquote class="blockquote mt-3">
                        <p class="mb-0 text-success">Başarılı : <b id="success-counter">0</b></p>
                    </blockquote>
                    <blockquote class="blockquote mt-3">
                        <p class="mb-0 text-danger">Hatalı : <b id="error-counter">0</b></p>
                    </blockquote>
                    <blockquote class="blockquote mt-3">
                        <p class="mb-0 text-secondary">Kalan : <b id="last-counter">${clicked.length}</b></p>
                    </blockquote>
                    <br>
                    <div class="progress">
                        <div id="progress-sending-selected" class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    `,
        }).then((e) => {
            if (e.dismiss === "cancel") {
                cancelled = true;
            } else {
                console.log(e);
            }
        });
        let counter = 0;
        let errored = 0;
        let successed = 0;
        let total = clicked.length;
        let error_list = "";
        clicked.each((id) => {
            requests.push({
                type: "POST",
                url: "/invoices/waiting/" + id + "?test=test",
                success: (success) => {
                    successed++;
                    $("#success-counter").text(
                        Number($("#success-counter").text()) + 1
                    );
                },
                error: (error) => {
                    errored++;
                    let error_detail = "";
                    try {
                        error_detail = error.responseJSON?.data.map((err) => {
                            return `${err.message} <br>`;
                        });
                    } catch (terror) {
                        error_detail = error.responseJSON?.data
                            ? error.responseJSON?.data
                            : error.responseJSON;
                    }
                    error_list += `<tr><td>${id}</td><td>${JSON.stringify(
                        error_detail
                    )}</td></tr>`;
                    $("#error-counter").text(
                        Number($("#error-counter").text()) + 1
                    );
                },
                complete: () => {
                    counter++;
                    $("#last-counter").text(requests.length - counter);
                    $("#progress-sending-selected")
                        .css("width", (100 * counter) / requests.length + "%")
                        .attr(
                            "aria-valuenow",
                            (100 * counter) / requests.length
                        );
                },
            });
        });
        ajaxThrottle({
            requests: requests,
            limit: 1,
            cancellationToken: () => cancelled,
            onAllSettled: () => {
                Swal.fire({
                    showConfirmButton: true,
                    showDenyButton: errored ? true : false,
                    showCancelButton: false,
                    confirmButtonText: "Tamam",
                    denyButtonText: errored ? "Hata Detayları" : "",
                    html: `
                            <h4>Gönderim tamamlandı!</h4>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-secondary">Toplam Gönderilen : <b>${
                                    counter + 1
                                }</b></p>
                            </blockquote>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-success">Başarılı : <b id="success-counter">${successed}</b></p>
                            </blockquote>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-danger">Hatalı : <b id="error-counter">${errored}</b></p>
                            </blockquote>
                            `,
                }).then((e) => {
                    invoice_table.columns().checkboxes.deselect(true);
                    invoice_table.draw();
                    if (e.isDenied) {
                        Swal.fire({
                            html: `
                                <table style="width:100%" class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th style="width:20%">ID</th>
                                            <th>Hata</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-border-bottom-0">
                                        ${error_list}
                                    </tbody>
                                </table>`,
                            showConfirmButton: true,
                            width: "45em",
                            showCancelButton: false,
                            confirmButtonText: "Tamam",
                        });
                    }
                });
            },
            onAnyFailed: () => {},
            onCancelled: () => {
                Swal.fire({
                    showConfirmButton: true,
                    showDenyButton: errored ? true : false,
                    showCancelButton: false,
                    confirmButtonText: "Tamam",
                    denyButtonText: errored ? "Hata Detayları" : "",
                    html: `
                            <h4>İşlem İptal Edildi!</h4>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-secondary">Toplam Gönderilen : <b>${
                                    counter + 1
                                }</b></p>
                            </blockquote>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-success">Başarılı : <b id="success-counter">${successed}</b></p>
                            </blockquote>
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0 text-danger">Hatalı : <b id="error-counter">${errored}</b></p>
                            </blockquote>
                            `,
                }).then((e) => {
                    invoice_table.columns().checkboxes.deselect(true);
                    invoice_table.draw();
                    if (e.isDenied) {
                        Swal.fire({
                            html: `
                                <table style="width:100%" class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th style="width:20%">ID</th>
                                            <th>Hata</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-border-bottom-0">
                                        ${error_list}
                                    </tbody>
                                </table>`,
                            showConfirmButton: true,
                            width: "45em",
                            showCancelButton: false,
                            confirmButtonText: "Tamam",
                        });
                    }
                });
            },
        });
    };

    const sendSingleSelected = (data) => {
        Swal.fire({
            title: `${
                data.erp_no ? data.erp_no + " numaralı" : "Seçili"
            } faturayı göndermek istediğinize emin misiniz?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Evet`,
            cancelButtonText: `Hayır`,
            preConfirm: () => {
                return $.ajax({
                    type: "POST",
                    url: `/invoices/waiting/${
                        data.id ? data.id : data
                    }?test=test`,
                    success: function (response) {
                        return true;
                    },
                });
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Başarılı!",
                        text: "Faturanız başarıyla gönderildi!",
                        icon: "success",
                    }).then((e) => {
                        invoice_table.columns().checkboxes.deselect(true);
                        invoice_table.draw();
                    });
                }
            })
            .catch((err) => {
                let error_detail = "";
                try {
                    error_detail = err.responseJSON.data.map((error) => {
                        return `${error.message} <br>`;
                    });
                } catch (error) {
                    error_detail = err.responseJSON?.data
                        ? err.responseJSON?.data
                        : err.responseJSON;
                }
                Swal.fire(
                    "Hata!!",
                    "" + JSON.stringify(error_detail),
                    "error"
                ).then((e) => {
                    invoice_table.columns().checkboxes.deselect(true);
                    invoice_table.draw();
                });
            });
    };

    function ajaxThrottle(opts) {
        let ajaxReqs = 0;
        const ajaxQueue = [];
        let ajaxActive = 0;
        let cancelled = false;
        let anyFailed = false;
        opts = Object.assign({ limit: 3 }, opts);

        for (const obj of opts.requests) {
            ajaxReqs++;
            const oldSuccess = obj.success;
            const oldError = obj.error;
            const callback = function () {
                if (cancelled) return;
                if (anyFailed) return;
                if (opts.cancellationToken()) {
                    ajaxReqs = 0;
                    ajaxQueue.length = 0;
                    cancelled = true;
                    if (opts.onCancelled) opts.onCancelled();
                    return;
                }
                ajaxReqs--;
                if (ajaxActive === opts.limit) {
                    $.ajax(ajaxQueue.shift());
                } else {
                    ajaxActive--;
                }
                if (ajaxReqs === 0) {
                    if (opts.onAllSettled) opts.onAllSettled();
                }
            };
            obj.success = function (resp, xhr, status) {
                callback();
                if (oldSuccess) oldSuccess(resp, xhr, status);
            };
            obj.error = function (xhr, status, error) {
                callback();
                if (oldError) oldError(xhr, status, error);
                // anyFailed = true
                // ajaxReqs = 0;
                // ajaxQueue.length = 0;
                if (opts.onAnyFailed) opts.onAnyFailed();
            };
            if (ajaxActive === opts.limit) {
                ajaxQueue.push(obj);
            } else {
                ajaxActive++;
                $.ajax(obj);
            }
        }
    }
});
