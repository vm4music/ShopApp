if (document.getElementsByClassName('heart__button').length > 0) {
    $(document).ready(function () {

        $('.heart__button').on('click', function (e) {
            e.preventDefault();

            $("#heart").toggleClass("bxs-heart")
            $("#heart").toggleClass("bx-heart")

            $.ajax({
                url: "/wishlist",
                data: {
                    wishlist: $("#wishlist").val(),
                    pid: $("#pid").val()
                },
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function (res) {
                    if (res.message) {
                        $(".alert").text(res.message);

                        $("#snackbar").html(res.message);
                        $("#snackbar").toggleClass('show ""');

                        setTimeout(function () {
                            $("#snackbar").toggleClass('"" show');
                        }, 3000);
                    } else {
                        window.location.href = "/users/login"
                    }

                },
                error: function (error) {
                    console.log(error)
                }
            })

        });
    })
}

if (document.getElementsByClassName('action__buttons').length > 0) {
    $(document).ready(function () {

        $('.button__add__2cart__button').on('click', function (e) {
            e.preventDefault();

            $.ajax({
                url: "/add-to-cart",
                data: {
                    product__ID: $("#product-add-to-cart").val() || $('product-add-to-cart-mobile').val(),
                    
                    // pid: $("#pid").val()
                },
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function (res) {
                    // console.log(res.status)
                    if(res.status == 401)
                        window.location.href = res.message;
                    if (res.status == 'Success') {
                        $('#responsiveFlyoutBasket_itemsCount').html(res.cart.totalQty)
                        $('#responsiveFlyoutBasket_itemsCount__mobile').html(res.cart.totalQty)

                        $("#snackbar").html(res.message);
                        $("#snackbar").toggleClass('show ""');

                        setTimeout(function () {
                            $("#snackbar").toggleClass('"" show');
                        }, 3000);

                    }       
                },
                error: function (error) {
                    console.log(error.message + " From Ajax")
                }
            })
        });
    })
}