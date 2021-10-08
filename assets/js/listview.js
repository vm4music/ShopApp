
    $(document).ready(function () {

        $("#menu-toggler").click(function () {
            toggleBodyClass("menu-active");
        });

        function toggleBodyClass(className) {
            document.body.classList.toggle(className);
        }


        $('.heart__button__list').on('click', function (e) {
            e.preventDefault();

            var form = $(this).closest('form');
            var formdata = form.serialize().toString();
            var id = formdata.substr(formdata.indexOf("pid") + 4);
            console.log(id)
            $("#heart_" + id).toggleClass("bxs-heart")
            $("#heart_" + id).toggleClass("bx-heart")

            $.ajax({
                url: "/wishlist",
                data: form.serialize(),
                method: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function (res) {
                    if (res.message) {
                        $(".alert").text(res.message)
                        console.log(res.message)
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

