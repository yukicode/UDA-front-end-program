var cats = [
    {
        index: 0,
        img: "./img/cat.jpg",
        name: "Meme",
        count: 0,
        nickName: ["Lily", "Blacky"],
    },
    {
        index: 1,
        img: "./img/cat-2.jpg",
        name: "Tabby",
        count: 0,
        nickName: ["Smokey", "Gracy"],
    },
    {
        index: 2,
        img: "./img/cat-3.jpg",
        name: "Scarlet",
        count: 0,
        nickName: ["Scarlet"],
    },
    {
        index: 3,
        img: "./img/cat-4.jpg",
        name: "Another",
        count: 0,
        nickName: ["Light", "Bud"],
    },
    {
        index: 4,
        img: "./img/cat-5.jpg",
        name: "Light",
        count: 0,
        nickName: ["Hand", "Foot", "Bag"],
    }
];

var Cat = function(data){
    this.catName = ko.observable(data.name);
    this.catImg = ko.observable(data.img);
    this.catCount = ko.observable(data.count);
    this.catLevel= ko.computed(function(){
        var level;
        if(this.catCount()<10){
            level = "New Born";
        }else if (this.catCount()<20){
            level = "Teen";
        }else {
            level = "Adult";
        }
        return level;
    }, this);
    this.nickname = ko.observableArray(data.nickName);
};

function appViewModel(){
    var self = this;
    this.allCats = ko.observableArray([]);
    this.allOptions = ko.observableArray([]);
    cats.forEach(function(cat){
        self.allCats.push(new Cat(cat));
        self.allOptions.push({name: cat.name, v: cat.index});
    });
    this.selectedCat = ko.observable('cat');
    this.currentCat = ko.computed(function(){
        return this.allCats()[this.selectedCat()];
    }, this);
    this.addCount = function(){
        self.currentCat().catCount(self.currentCat().catCount()+1);
    };
}


function load(){
    ko.applyBindings(new appViewModel());
}