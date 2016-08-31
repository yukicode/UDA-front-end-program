//property and map data
var model = {
    data:apts,
    defaultLoc: {lat:47.610377, lng:-122.200679},
    defaultZoom: 10,
};

var viewModel = {
    init: function(){
        view.init(model.defaultLoc, model.defaultZoom);
    }
};

var view = {
    init: function(loc, locZoom){
        var map;
        map = new google.maps.Map(document.getElementById("map"), {
            center: loc,
            zoom: locZoom,
        });
    }
};

viewModel.init();