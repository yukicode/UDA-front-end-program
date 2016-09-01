//property and map data
var model = {
    map: {},
    workMarker: {},
    aptList: apts,
    aptMarkerList: [],
    aptInfo: {},
    defaultLoc: { lat: 47.610377, lng: -122.200679 },
    defaultZoom: 12,
};

var viewModel = {
    init: function () {
        view.renderMap();
        this.initInfoWindow();
        this.setWorkMarker();
        this.addAptMarkers(50);
        view.renderInfoWindow();
    },
    setWorkMarker: function () {
        if (!model.map) { return; }
        model.workMarker = new google.maps.Marker({
            position: model.defaultLoc,
            map: model.map,
            icon: { url: "./images/purple_MarkerW.png" },
            title: "Work Location",
        });
        view.renderMarker(model.map, model.workMarker);
    },
    addAptMarkers: function (count) {
        if (!model.aptList || !model.map) { return; }
        var length = count || aptList.length;
        for (var i = 0; i < length; i++) {
            if (!model.aptList[i]) { break; }
            var marker = new google.maps.Marker({
                position: model.aptList[i].loc,
                map: model.map,
                title: model.aptList[i].name,
                aptIndex: i,
            });
            model.aptMarkerList.push(marker);
            view.renderMarker(model.map, marker, model.aptInfo);
        }
    },
    initInfoWindow: function () {
        model.aptInfo = new google.maps.InfoWindow({ marker: null });
    },
    getInfoContent: function (marker) {
        var i = marker.aptIndex,
            name = model.aptList[i].name || "",
            phone = model.aptList[i].phone || "",
            priceRange = model.aptList[i].priceRange || "";
        var contentString = '<div id="content">' +
            '<h3>' + name + '</h3>' +
            '<p>' + "Tel: " + phone + '</p>' +
            '<p>' + priceRange + '</p>' +
            '</div>';
        return contentString;
    },
};

var view = {
    renderMap: function () {
        model.map = new google.maps.Map(document.getElementById("map"), {
            center: model.defaultLoc,
            zoom: model.defaultZoom,
        });
    },
    renderMarker: function (map, marker, infoWindow) {
        var self = this;
        if (!map || !marker) { return; }
        marker.setMap(map);
        marker.addListener('click', function () {
            self.renderInfoWindow(map, marker, infoWindow);
        });
    },
    renderInfoWindow: function (map, marker, infoWindow) {
        if (infoWindow && infoWindow.marker != marker) {
            infoWindow.setContent(viewModel.getInfoContent(marker));
            infoWindow.marker = marker;
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            });
            infoWindow.open(map, marker);
        }
    },
};

viewModel.init();