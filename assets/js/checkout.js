// Get the modal
var modal = document.getElementById('new-address');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    
  }
}

function openDialog() {

  document.getElementById('new-address').style.display = 'block';
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  // modal.style.overflowY = 'hidden';
}

function closeDialog() {
  document.getElementById('new-address').style.display = 'none';
  document.getElementsByTagName('body')[0].style.overflowY = 'initial';
  
  
}

$(document).ready(function () {

  $('.signupbtn').on('click', function (e) {

    e.preventDefault();

    $.ajax({
      url: "/checkout/add-address",
      data: {
        firstname: $("#fname").val(),
        phone: $('#phone').val(),
        address: $('#adr').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip: $('#zip').val()
      },
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      success: function (res) {

        $("#snackbar").html(res.message);
        $("#snackbar").toggleClass('show ""');

        setTimeout(function () {
          $("#snackbar").toggleClass('"" show');
        }, 3000);

        document.getElementById('new-address').style.display = 'none';
      },
      error: function (error) {
        alert(error);
      }
    })
  });
})