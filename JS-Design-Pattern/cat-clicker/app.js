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
        img: "./img/cat-4.jpg",
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

var oct = {
    init: function(){
        selectView.init();
        detailView.init();
    },
    getLength: function(){
        return cats.length;
    },
    currentCatId: 0,
    getCurrentCatDetail: function(){
        return cats[this.currentCatId];
    },
    getCurrentCatCount: function(){
        return cats[this.currentCatId].count;
    },
    addCount: function(){
        cats[this.currentCatId].count++;
    }
};

var selectView = {
    init: function(){
        var selection = document.getElementById("cat-select");
        var length = oct.getLength();
        var option;
        for(var i=0; i<length; i++){
            option = document.createElement("option");
            option.value = i;
            option.innerHTML = "cat " + i;
            selection.appendChild(option);
        }
        selection.addEventListener('change', function(){
            oct.currentCatId = selection.value;
            detailView.render();
        });
    }
};

var detailView = {
    init: function(){
        var detail = document.getElementById("cat-detail");
        this.name = document.getElementById("name");
        this.img = detail.getElementsByClassName("cat-img")[0];
        this.clickCount = detail.getElementsByClassName("click-count")[0];
        //important pattern!
        this.img.addEventListener('click', (function(ele){
            return function(){
                        oct.addCount();
                        ele.innerHTML = oct.getCurrentCatCount();
                    };
        })(this.clickCount));
        this.render();
    },
    render: function(){
        var cat = oct.getCurrentCatDetail();
        this.name.innerHTML = cat.name;
        this.img.src = cat.img;
        this.img.id = "cat"+oct.currentCatId;
        this.clickCount.innerHTML= cat.count;
    }
};

function load(){
    oct.init();
}