$(document).ready(function () {
    const invoice_table = $("#invoices").DataTable({
        language: {
            url: "/vendor/libs/datatables/language/dataTables.tr.json",
        },
        ordering: false,
        serverSide: true,
        processing: true,
        ajax: {
            url: "/datatablesQuery/outgoing/einvoices",
            data: (d) => {
                return $.extend({}, d, {
                    query: {
                        document: "einvoice",
                        direction: "out",
                        start_date: fdateObject.formatDate(
                            fdateObject.selectedDates[0],
                            "Y-m-d"
                        ),
                        end_date: ldateObject.formatDate(
                            ldateObject.selectedDates[0],
                            "Y-m-d"
                        ),
                        sort_defs: [
                            {
                                field: $("#order").val(),
                                direction: $("#dir").val(),
                            },
                        ],
                        q: $("#searchbox").val(),
                        page_size: Number(d.length),
                        page_index: Number(d.start) / Number(d.length) + 1,
                        status_codes: $("#status").val(),
                        reply_status_codes: $("#reply_status").val(),
                        printed:
                            $("#print_status").val() == ""
                                ? undefined
                                : $("#print_status").val(),
                        read_marked:
                            $("#read_status").val() == ""
                                ? undefined
                                : $("#read_status").val(),
                        profile_ids: $("#profile").val(),
                        type_codes: $("#type").val(),
                    },
                });
            },
        },
        columns: [
            { data: "id" },
            { data: "readed" },
            { data: "printed" },
            { data: "inv_no" },
            { data: "inv_type" },
            { data: "inv_profile" },
            { data: "inv_total" },
            { data: "inv_tax" },
            { data: "inv_currency" },
            { data: "inv_date" },
            { data: "inv_env_date" },
            { data: "receiver_name" },
            { data: "receiver_tax" },
            { data: "status_code" },
            { data: "status_description" },
            { data: "reply" },
            { data: "reply_code" },
            { data: "percentage" },
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
                render: (data, type, row) => {
                    let read = "";
                    let print = "";
                    if (data) {
                        read = `<i class="text-success fa-solid fa-envelope-open fa-xl" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Okunma Tarihi: ${data}"></i>`;
                    } else {
                        read = `<i class="text-warning fa-solid fa-envelope fa-xl"></i>`;
                    }
                    if (row["printed"]) {
                        print = `<i class="text-success fa-solid fa-print fa-xl" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Yazdırılma Tarihi: ${row["printed"]}"></i>`;
                    } else {
                        print = `<i class="text-warning fa-solid fa-print fa-xl"></i>`;
                    }
                    return `${read} | ${print}`;
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    let type_class;
                    switch (row["inv_type"]) {
                        case "SATIS":
                            type_class = "success";
                            break;
                        case "ISTISNA":
                            type_class = "warning";
                            break;
                        default:
                            type_class = "info";
                            break;
                    }

                    let profile_type;

                    switch (row["inv_profile"]) {
                        case "TICARIFATURA":
                            profile_type = "info";
                            break;
                        case "TEMELFATURA":
                            profile_type = "secondary";
                            break;
                        case "IHRACAT":
                            profile_type = "success";
                            break;
                        default:
                            profile_type = "danger";
                            break;
                    }

                    return `<i class="fa-solid fa-hashtag fa-sm"></i> <b>${data}</b><br><span class="badge bg-${type_class}">${row["inv_type"]}</span> | <span class="badge bg-label-${profile_type}">${row["inv_profile"]}</span>`;
                },
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    return `<b>Toplam: </b>${data} ${row["inv_currency"]}<br><b>Vergi: </b>${row["inv_tax"]} ${row["inv_currency"]}`;
                },
            },
            {
                targets: 9,
                render: (data, type, row) => {
                    return `<b>Fatura: </b>${data}<br><b>Zarf: </b>${row["inv_env_date"]}`;
                },
            },
            {
                targets: 11,
                render: (data, type, row) => {
                    return `${
                        data.length > 25 ? data.substring(0, 25) + "..." : data
                    }<br>${row["receiver_tax"]}`;
                },
            },
            {
                targets: 13,
                render: (data, type, row) => {
                    let type_class;
                    if (row["percentage"] == 100 && data == 4000) {
                        type_class = "danger";
                    } else if (row["percentage"] == 100) {
                        type_class = "success";
                    } else {
                        type_class = "warning";
                    }
                    return `<b>${row["status_description"]}</b><br><div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-${type_class}" role="progressbar" style="width: ${row["percentage"]}%" aria-valuenow="${row["percentage"]}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>`;
                },
            },
            {
                targets: 15,
                render: (data, type, row) => {
                    let icon;
                    let color;
                    switch (row["reply_code"]) {
                        case 2004:
                            icon = "square";
                            color = "text-warning";
                            break;
                        case 2005:
                            icon = "square-check";
                            color = "text-success";
                            break;
                        case 2006:
                            icon = "square-xmark";
                            color = "text-danger";
                            break;
                        case 2011:
                            icon = "square-check";
                            color = "text-success";
                            break;
                        default:
                            icon = "";
                            color = "text-secondary";
                            break;
                    }
                    return `<b class="${color}"><i class="fa-solid fa-${icon} me-1"></i>${data}</b>`;
                },
            },
            {
                targets: [2, 4, 5, 7, 8, 10, 12, 14, 16, 17],
                visible: false,
            },
        ],
        dom: 't<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p><"col-sm-12 col-md-6"l>>',
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

    $("#submit-fo").click((e) => {
        searchTable();
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
});
