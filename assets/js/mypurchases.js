// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    
  }
}


function openDialog(name, id){
  document.getElementById('id01').style.display='block';
  document.getElementById('product__modal__name').innerHTML = name;
  document.getElementById('product__modal__id').value = id;
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
  modal.style.overflowY = 'hidden';
}
function closeDialog(){
  document.getElementById('id01').style.display='none';
  document.getElementsByTagName('body')[0].style.overflowY = 'initial';
  $("input[type=radio][name=rating]").prop('checked', false);
         $('#review').val('')
}


$(document).ready(function(){
    
  $('.signupbtn').on('click',function(e){

    // console.log($('input[name="rating"]:checked').val());
    e.preventDefault();

   $.ajax({
       url : "/checkout/productreview",
       data : {
           product : $("#product__modal__id").val(),
           rating : $('input[name="rating"]:checked').val(),
           review : $('#review').val()
       },
       method : "POST",
       contentType : "application/x-www-form-urlencoded",
       success : function(res){
         alert(res.message);
         $("input[type=radio][name=rating]").prop('checked', false);
         $('#review').val('')
         document.getElementById('id01').style.display = 'none';
         document.getElementsByTagName('body')[0].style.overflowY = 'initial';
       },
       error : function(error){
        alert(error);
       }
   })
   
});


})