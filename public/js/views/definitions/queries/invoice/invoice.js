$(document).ready(function () {
    $("#save").click((e) => {
        let body = {
            header: {
                main: $("#header_main_editor").val(),
                notes: $("#header_notes_editor").val(),
                despatches: $("#header_despatches_editor").val(),
                order: $("#header_order_editor").val(),
                update_number: $("#header_update_num_editor").val(),
            },
            currents: {
                customer: $("#currents_customer_editor").val(),
            },
            lines: {
                main: $("#lines_main_editor").val(),
            },
        };
        $.ajax({
            type: "POST",
            url: "",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
            success: function (response) {
                toastr["success"](
                    `SQL Sorguları başarıyla güncellendi!`,
                    "Başarılı",
                    {
                        closeButton: true,
                        tapToDismiss: false,
                        progressBar: true,
                    }
                );
            },
            error: function (err) {
                console.log(err);
                Swal.fire(
                    "Hata!!",
                    "Hata Detayı : " + JSON.stringify(err),
                    "error"
                );
            },
        });
    });
});
