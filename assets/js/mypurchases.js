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
}