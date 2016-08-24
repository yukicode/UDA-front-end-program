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
        img: "./img/cat-5.jpg",
        name: "cat-5",
        count: 0,
    }
];

var oct = {
    init: function(){
        selectView.init();
        detailView.init();
        editView.init();
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
        detailView.render();
    },
    setCurrentCat: function(name, img){
        cats[this.currentCatId].name = editView.editName.value;
        cats[this.currentCatId].img = editView.editImg.value;
        detailView.render();
    },
    showDetail: function(){
        editView.editDetail.classList.remove("hidden");
        editView.render();
    },
    hideDetail: function(){
        editView.editDetail.classList.add("hidden");
        editView.render();
    },
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
        this.img.addEventListener('click', function(){
            oct.addCount();
        });
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

var editView = {
    init: function(){
        this.edit = document.getElementById("btn-edit");
        this.editDetail = document.getElementById("edit-detail");
        this.editImg = document.getElementById("edit-img");
        this.editName = document.getElementById("edit-name");
        this.cancel = document.getElementById("btn-cancel");
        this.save = document.getElementById("btn-save");

        this.edit.addEventListener('click', function(){
            oct.showDetail();
        });

        this.save.addEventListener('click', function(){
            oct.setCurrentCat();
            oct.hideDetail();
        });

        this.cancel.addEventListener('click', function(){
            oct.hideDetail();
        });
    },
    render: function(){
        this.cat = oct.getCurrentCatDetail();
        this.editName.value = this.cat.name;
        this.editImg.value = this.cat.img;
    },
}

function load(){
    oct.init();
}