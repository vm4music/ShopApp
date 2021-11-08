$(document).ready(function () {


    $("input,select, textarea").each(function () {
        var theValue = $(this).val();
        $(this).data("val", theValue);
    });

    $("input").change(function (e) {
        e.preventDefault();

        var currentqty = $(this).val();
        if (isNaN(currentqty))
            return;

        $.ajax({
            url: "/add-to-cart",
            data: {
                product__ID: $(this).attr('name'),
                qty: currentqty,
                prev_qty: $(this).data('val')
            },
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function (res) {
                //         // console.log(res.status)
                //         if(res.status == 401)
                //             window.location.href = res.message;
                if (res.status == 'Success') {
                    location.reload();
                }
            },
            //     error: function (error) {
            //         console.log(error.message + " From Ajax")
            //     }
        })

    })
})