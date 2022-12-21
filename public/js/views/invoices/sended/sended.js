$(document).ready(function () {
    const invoice_table = $("#invoices").DataTable({
        language: {
            url: "/vendor/libs/datatables/language/dataTables.tr.json",
        },
        serverSide: true,
        processing: true,
        ajax: {
            url: "/datatablesQuery/invoices/sended",
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
                    status_codes: $("#status").val(),
                });
            },
        },
        columns: [
            { data: "id" },
            { data: "erp_no" },
            { data: "invoice_no" },
            { data: "receiver_name" },
            { data: "receiver_tax" },
            { data: "invoice_date" },
            { data: "invoice_payable" },
            { data: "currency_code" },
            { data: "invoice_profile" },
            { data: "invoice_type" },
            { data: "status_code" },
            { data: "status_desc" },
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
                targets: 1,
                width: "10%",
                render: (data, type, row) => {
                    return `${data}<br><b>${row["invoice_no"]}</b>`;
                },
            },
            {
                targets: 3,
                width: "5%",
                render: (data, type, row) => {
                    return `${
                        String(data).length > 25
                            ? String(data).substring(0, 25) + "..."
                            : String(data)
                    }<br>${row["receiver_tax"]}`;
                },
            },
            {
                targets: 5,
                orderable: false,
                render: (data, type, row) => {
                    return `${data}<br>${Number(row["invoice_payable"]).toFixed(
                        2
                    )} ${row["currency_code"]}`;
                },
            },
            {
                targets: 8,
                orderable: false,
                className: "dt-center",
                render: (data, types, row) => {
                    let profile = "secondary";
                    let type = "secondary";
                    return `
                    <span class="badge bg-label-${profile} bg-glow d-block">${data}</span>
                    <span class="badge bg-label-${type} d-block mt-1">${row["invoice_type"]}</span>`;
                },
            },
            {
                targets: 10,
                orderable: false,
                className: "dt-center",
                render: (data, types, row) => {
                    let status = "";
                    let text = "";
                    switch (data) {
                        case 200:
                            status = "bg-label-success";
                            text = `<i class="fa-regular fa-square-check fa-xl"></i>&nbsp;&nbsp;Başarılı`;
                            break;
                        case 201:
                            status = "bg-label-primary";
                            text = `<i class="fa-regular fa-square-check fa-xl"></i>&nbsp;&nbsp;İşaretlendi!`;
                            break;
                        case 400:
                            status = "bg-danger bg-glow";
                            text = `<i class="fa-solid fa-square-xmark fa-xl"></i>&nbsp;&nbsp;&nbsp;Hatalı`;
                            break;
                        default:
                            status = "bg-warning bg-glow";
                            break;
                    }
                    return `
                    <span id="status-label" class="badge ${status} d-block">${text}</span>`;
                },
            },
            {
                targets: 12,
                className: "dt-right",
                width: "10px",
                orderable: false,
                render: (data, type, row) => {
                    let buttons = "";
                    let preview_button = `
                    <button id="preview-invoice" type="button" class="btn  btn-icon btn-info waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#preview-invoice-modal">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>`;
                    switch (row.status_code) {
                        case 200:
                            buttons += `<li>
                                            <a id="check-status" class="dropdown-item">
                                                <i class="fa-regular fa-pen-to-square fa-sm"></i> Durum Sorgula
                                            </a>
                                        </li>`;
                            break;
                        case 201:
                            buttons += `<li>
                                            <a id="mark-not-sended" class="dropdown-item">
                                                <i class="fa-regular fa-pen-to-square fa-sm"></i> Gönderilmedi olarak işaretle
                                            </a>
                                        </li>`;
                            break;
                        case 400:
                            buttons += `<li>
                                            <a id="mark-not-sended" class="dropdown-item">
                                                <i class="fa-regular fa-pen-to-square fa-sm"></i> Gönderilmedi olarak işaretle
                                            </a>
                                        </li>
                                        <li>
                                            <a id="mark-resolved" class="dropdown-item">
                                                <i class="fa-regular fa-pen-to-square fa-sm"></i> Çözüldü olarak işaretle
                                            </a>
                                        </li>`;
                            preview_button = "";
                            break;
                        default:
                            break;
                    }
                    return `<div class="btn-group" role="group" aria-label="Basic example">
                                ${preview_button}
                                <button type="button" class="btn btn-icon btn-label-warning waves-effect" 
                                data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end" style="">
                                    ${buttons}
                                </ul>
                            </div>`;
                },
            },
            {
                targets: [2, 4, 6, 7, 9, 11],
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

    $("#status").each(function () {
        var $this = $(this);
        $this
            .wrap('<div class="position-relative"></div>')
            .select2({
                dropdownParent: $this.parent(),
                placeholder: "Fatura Durumu",
                multiple: true,
                closeOnSelect: false,
                allowClear: true,
            })
            .on("change", (e) => {
                searchTable();
            })
            .val([])
            .trigger("change");
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

    $("#invoices tbody").on("click", "#check-status", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
    });

    $("#invoices tbody").on("click", "#mark-not-sended", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
        Swal.fire({
            title: `${data.erp_no}" numaralı faturayı gönderilmedi olarak işaretlemek istediğinize emin misiniz?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Evet`,
            cancelButtonText: `Hayır`,
            preConfirm: () => {
                return $.ajax({
                    type: "DELETE",
                    url: `/invoices/sended/${data.id}/mark/send`,
                    success: function (response) {
                        return true;
                    },
                });
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        })
            .then((result) => {
                toastr["success"](
                    `Başarıyla gönderilmedi işaretlendi!`,
                    "Başarılı",
                    {
                        closeButton: true,
                        tapToDismiss: false,
                        progressBar: true,
                    }
                );
                invoice_table.columns().checkboxes.deselect(true);
                invoice_table.draw();
            })
            .catch((err) => {
                Swal.fire("Hata!!", "Bir hata oluştu!", "error").then((e) => {
                    invoice_table.columns().checkboxes.deselect(true);
                    invoice_table.draw();
                });
            });
    });

    $("#invoices tbody").on("click", "#mark-resolved", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
        console.log("#mark-resolved edildi", data);
    });
    $("#invoices tbody").on("click", "#status-label", function () {
        let data = invoice_table.row($(this).parents("tr")).data();
        if (data.status_code == 400) {
            let error_detail = "";
            error_detail = JSON.parse(data.status_desc).detail.data[0]?.message
                ? JSON.parse(data.status_desc).detail.data[0]?.message
                : JSON.parse(data.status_desc).detail;
            Swal.fire({
                title: "Hata Detayı",
                text: `${error_detail}`,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: "Tamam",
            });
        }
    });

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
