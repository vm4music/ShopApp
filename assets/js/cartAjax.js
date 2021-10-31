$(document).ready(function () {
   
    var prev = $("#qty").val()
    // sel.data("prev",sel.val())
    document.getElementById('qty').addEventListener('change', (e)=>{
    // We add the show-menu class to the div tag with the nav__menu class
            e.preventDefault();

            var currentqty = $("#qty").val();
            if(isNaN(currentqty))
                return;

            $.ajax({
                url: "/add-to-cart",
                data: {
                    product__ID: $("#p_id").val(),
                    qty: currentqty,
                    prev_qty: prev
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