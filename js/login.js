window.addEventListener('load', (event) => {
  ploader=document.getElementById('ploader');      
  window.setInterval(myfun, 1800);
});
function myfun(){
  ploader.style.display='none';
}