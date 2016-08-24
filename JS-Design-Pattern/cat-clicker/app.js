// var count = 0;
// var img = document.getElementById("cat-img");
// var displayTime = document.getElementById("click-count");

var counts = [];
var cats = [
    {
        index: 0,
        img: "./img/cat.jpg",
        name: "cat-1",
    },
    {
        index: 1,
        img: "./img/cat-2.jpg",
        name: "cat-2",
    }
];
var clone, temp, tempImg, tempName, tempCount, img, name;
temp = document.getElementsByTagName("template")[0];
tempImg = temp.content.querySelector('img');
tempName = temp.content.querySelector(".name");
tempCount = temp.content.querySelector(".click-count");

cats.forEach(function(cat){
    tempImg.src = cat.img;
    tempImg.id = cat.name;
    tempName.innerHTML = cat.name;
    tempCount.id = "count" + cat.index;
    clone = document.importNode(temp.content, true);
    document.body.appendChild(clone);
    counts.push(0);
    img = document.getElementById(cat.name);
    img.addEventListener('click', function(){
        addCount(cat.index);
        count = document.getElementById("count" + cat.index);
        count.innerHTML = counts[cat.index];

    });
});

function addCount(i){
    counts[i] ++;
}