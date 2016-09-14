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
        view.init();
        this.setMap();
        this.initInfoWindow();
        this.setWorkMarker();
        this.addAptMarkers(50);
        view.renderInfoWindow();
        ko.applyBindings({
            markList: model.aptMarkerList,
            display: function (marker) {
                view.renderInfoWindow(model.map, marker, model.aptInfo);
            }
        });
    },
    setMap: function () {
        model.map = new google.maps.Map(view.mapDiv, {
            center: model.defaultLoc,
            zoom: model.defaultZoom,
        });
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
            priceRange = model.aptList[i].priceRange || "Unknown",
            yelp = this.getYelp(marker);
        var contentString = '<div id="content">' +
            '<h4>' + name + '</h4>' +
            '<p>' + "Tel: " + phone + '</p>' +
            '<p>' + "Price Range: " + priceRange + '</p>';

        if (yelp) {
            contentString += yelp;
        }
        contentString += '</div>';
        return contentString;
    },
    getYelp: function (marker) {
        var self = this;
        var formattedString = '';
        var i = marker.aptIndex,
            term = model.aptList[i].name || "",
            lat = model.aptList[i].loc.lat || 0;
        lng = model.aptList[i].loc.lng || 0;
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/api/yelp/",
            data: {
                term: term,
                lat: lat,
                lng: lng,
            },
            async: false,
        }).done(function (data) {
            if (data.message) {
                console.log("error needs to be handled", data.message);
            }else{
                formattedString = self.formatYelp(data);
            }
        }).fail(function (err) {
            console.log(err);
        });
        return formattedString;
    },
    formatYelp: function (data) {
        var formattedString = '',
            rating, ratingImg, ratingCount, yelpLink, yelpImage, yelpSnippet;

        rating = data.rating || "";
        if (rating) {
            ratingImg = this.getRatingImg(rating);
        }
        ratingCount = data.review_count || 0;
        yelpLink = data.url || "";
        yelpImage = data.image_url || "";
        yelpSnippet = data.snippet_text || "";
        formattedString = '<a href="' + yelpLink + '" target="_blank">' + '<p>' + "Yelp Review: " + ratingImg + '(' + ratingCount + ')' + '</p>' + '</a>';
        return formattedString;
    },
    getRatingImg: function (rating) {
        var fullStar = "&#9733;",
            halfStar = "&#10030;",
            emptyStar = "&#9734;";
        switch (rating) {
            case 1:
                return fullStar + emptyStar + emptyStar + emptyStar + emptyStar;
            case 1.5:
                return fullStar + halfStar + emptyStar + emptyStar + emptyStar;
            case 2:
                return fullStar + fullStar + emptyStar + emptyStar + emptyStar;
            case 2.5:
                return fullStar + fullStar + halfStar + emptyStar + emptyStar;
            case 3:
                return fullStar + fullStar + fullStar + emptyStar + emptyStar;
            case 3.5:
                return fullStar + fullStar + fullStar + halfStar + emptyStar;
            case 4:
                return fullStar + fullStar + fullStar + fullStar + emptyStar;
            case 4.5:
                return fullStar + fullStar + fullStar + fullStar + halfStar;
            case 5:
                return fullStar + fullStar + fullStar + fullStar + fullStar;
            default:
                return emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;
        }
    },
};

var view = {
    init: function () {
        this.mapDiv = document.getElementById("map");
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