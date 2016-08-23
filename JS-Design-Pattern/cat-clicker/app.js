var count = 0;
var img = document.getElementById("cat-img");
var displayTime = document.getElementById("click-count");
function addCount(){
    count ++;
}

img.addEventListener('click', function(){
    addCount();
    displayTime.innerHTML = count;
});