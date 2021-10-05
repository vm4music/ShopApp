// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    
  }
}

var order__ID, product__ID = '';
function openDialog(name, id, orderid){
  product__ID = id;
  order__ID = orderid;
  document.getElementById('id01').style.display='block';
  document.getElementById('product__modal__name').innerHTML = name;
  document.getElementById('product__modal__id').value = id;
  $('#product__order__id').val(orderid)
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  modal.style.overflowY = 'hidden';
}
function closeDialog(){
  document.getElementById('id01').style.display='none';
  document.getElementsByTagName('body')[0].style.overflowY = 'initial';
  $("input[type=radio][name=rating]").prop('checked', false);
         $('#review').val('')
}


$(document).ready(function () {

  $('.signupbtn').on('click', function (e) {

    // console.log($('input[name="rating"]:checked').val());
    e.preventDefault();

    $.ajax({
      url: "/checkout/productreview",
      data: {
        product: $("#product__modal__id").val(),
        orderId: $('#product__order__id').val(),
        rating: $('input[name="rating"]:checked').val(),
        review: $('#review').val()
      },
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      success: function (res) {

        $("input[type=radio][name=rating]").prop('checked', false);
        $('#review').val('')
        document.getElementById('id01').style.display = 'none';
        document.getElementsByTagName('body')[0].style.overflowY = 'initial';
        $('#rating_button__').hide();
        $("#snackbar").html(res.message);
        $('#rating_button__'+product__ID+order__ID).html('Reviewed');
        $("#snackbar").toggleClass('show ""');

        setTimeout(function () {
          $("#snackbar").toggleClass('"" show');
        }, 3000);

      },
      error: function (error) {
        alert(error);
      }
    })
  });
})