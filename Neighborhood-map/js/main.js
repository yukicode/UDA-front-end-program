//property and map data
var model = {
    data: apts,
    defaultLoc: { lat: 47.610377, lng: -122.200679 },
    defaultZoom: 10,
};

var viewModel = {
    init: function () {
        view.init(model.defaultLoc, model.defaultZoom);
        view.addAptMarkers(model.data, 5);
    }
};

var view = {
    init: function (loc, locZoom) {
        var map;
        map = new google.maps.Map(document.getElementById("map"), {
            center: loc,
            zoom: locZoom,
        });
        var defaultMarker = new google.maps.Marker({
            position: loc,
            map: map,
            icon: { url: "./images/purple_MarkerW.png" },
            title: "Work Location",
        });
        defaultMarker.setMap(map);
    },
    addAptMarkers: function (aptList, count) {
        if (!aptList || !(aptList instanceof Array)) { return; }
        if (count) {
            for (var i = 0; i < count; i++) {
                console.log(aptList[i]);
            }
        }else{
            console.log("Load all");
        }
    },
};

viewModel.init();