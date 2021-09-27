// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    
  }
}


function openDialog(){
  document.getElementById('id01').style.display='block';
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
}
function closeDialog(){
  document.getElementById('id01').style.display='none';
  document.getElementsByTagName('body')[0].style.overflowY = 'initial';
}