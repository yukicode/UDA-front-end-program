var cats = [
    {
        index: 0,
        img: "./img/cat.jpg",
        name: "cat-1",
        count: 0,
    },
    {
        index: 1,
        img: "./img/cat-2.jpg",
        name: "cat-2",
        count: 0,
    },
    {
        index: 2,
        img: "./img/cat-3.jpg",
        name: "cat-3",
        count: 0,
    },
    {
        index: 3,
        img: "./img/cat-3.jpg",
        name: "cat-4",
        count: 0,
    },
    {
        index: 4,
        img: "./img/cat-3.jpg",
        name: "cat-5",
        count: 0,
    }
];

function load(){
    var selection = document.getElementById("cat-select");
    var length = cats.length;
    var option;

    var detail = document.getElementById("cat-detail");
    var name = document.getElementById("name");
    var img = detail.getElementsByClassName("cat-img")[0];
    var clickCount = detail.getElementsByClassName("click-count")[0];

    for(var i=0; i<length; i++){
        option = document.createElement("option");
        option.value = i;
        option.innerHTML = cats[i].name;
        selection.appendChild(option);
    }
    img.addEventListener('click', function(){
        addCount(img.id[3]);
        clickCount.innerHTML = cats[img.id[3]].count;
    });
    changeCat(0);
    function changeCat(i){
        name.innerHTML = cats[i].name;
        img.src = cats[i].img;
        img.id = "cat"+i;
        clickCount.innerHTML= cats[i].count;
    }

    function addCount(i){
        cats[i].count++;
    }

    selection.addEventListener('change', function(){
        changeCat(selection.value);
    });
}

//using template html
// var clone, temp, tempImg, tempName, tempCount, img, name;
// temp = document.getElementsByTagName("template")[0];
// tempImg = temp.content.querySelector('img');
// tempName = temp.content.querySelector(".name");
// tempCount = temp.content.querySelector(".click-count");

// cats.forEach(function(cat){
//     tempImg.src = cat.img;
//     tempImg.id = cat.name;
//     tempName.innerHTML = cat.name;
//     tempCount.id = "count" + cat.index;
//     clone = document.importNode(temp.content, true);
//     document.body.appendChild(clone);
//     counts.push(0);
//     img = document.getElementById(cat.name);
//     img.addEventListener('click', function(){
//         addCount(cat.index);
//         count = document.getElementById("count" + cat.index);
//         count.innerHTML = counts[cat.index];
//     });
// });

// function addCount(i){
//     counts[i] ++;
// }