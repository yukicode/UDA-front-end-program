//TODO handle networkerror for yelp

//property and map data
var model = {
    aptList: apts,
    aptMarkerList: [],
    defaultLoc: { lat: 47.610377, lng: -122.200679 },
    defaultZoom: 12,
};

var viewModel = {
    init: function () {
        var self = this;
        view.init();
        this.setMap();
        this.setInfoWindow();
        this.setWorkMarker();
        this.setAptMarkers(50);
        this.currentMarker = null;
        ko.applyBindings({
            markList: model.aptMarkerList,
            display: function (marker) {
                self.currentMarker = marker;
                view.updateInfoWindow();
            }
        });
    },
    setMap: function () {
        this.map = new google.maps.Map(view.mapDiv, {
            center: model.defaultLoc,
            zoom: model.defaultZoom,
        });
    },
    setWorkMarker: function () {
        if (!this.map) { return; }
        this.workMarker = new google.maps.Marker({
            position: model.defaultLoc,
            map: this.map,
            icon: { url: "./images/purple_MarkerW.png" },
            title: "Work Location",
        });
        view.renderMarker(this.workMarker);
    },
    setAptMarkers: function (count) {
        if (!model.aptList || !this.map) { return; }
        var length = count || aptList.length;
        for (var i = 0; i < length; i++) {
            if (!model.aptList[i]) { break; }
            var marker = new google.maps.Marker({
                position: model.aptList[i].loc,
                map: this.map,
                title: model.aptList[i].name,
                aptIndex: i,
            });
            model.aptMarkerList.push(marker);
            view.renderMarker(marker);
        }
    },
    setInfoWindow: function () {
        this.infoWin = new google.maps.InfoWindow({ marker: null });
    },
    updateInfoWindow: function () {
        console.log("currentmarker in updateinfowindow", this.currentMarker);
        this.updateBasicInfo();
        this.updateYelpInfo();
    },
    updateBasicInfo: function () {
        var i = this.currentMarker.aptIndex,
            name = model.aptList[i].name || "",
            phone = model.aptList[i].phone || "Unknown",
            priceRange = model.aptList[i].priceRange || "Unknown";

        view.renderBasicInfo(name, phone, priceRange);
    },
    updateYelpInfo: function () {
        var marker = this.currentMarker;
        if (!marker) { return; }
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
        }).done(function (data) {
            if (data.message) { //if the data comes with a message, then there is an error getting data from yelp
                console.log("error needs to be handled", data.message);
            } else {
                view.renderYelpInfo(data);
            }
        }).fail(function (err) {
            console.log(err);
        });
    },
};

var view = {
    init: function () {
        this.mapDiv = document.getElementById("map");
        this.formattedInfoContent = {
            start: '<div id="content">',
            end: '</div>',
            basic: '',
            yelp: '',
            google: '',
        };
    },
    renderMarker: function (marker) {
        var self = this;
        if (!viewModel.map || !marker) { return; }
        marker.setMap(viewModel.map);
        marker.addListener('click', function () {
            self.formattedInfoContent = {
                start: '<div id="content">',
                end: '</div>',
                basic: '',
                yelp: '',
                google: '',
            };
            viewModel.currentMarker = marker;
            viewModel.updateInfoWindow();
        });
    },
    renderInfoWindow: function () {
        var infoWindow = viewModel.infoWin,
            marker = viewModel.currentMarker,
            content = this.formattedInfoContent.start +
                this.formattedInfoContent.basic +
                this.formattedInfoContent.yelp +
                this.formattedInfoContent.google +
                this.formattedInfoContent.end;

        if (infoWindow) {
            infoWindow.setContent(content);
            infoWindow.marker = marker;
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            });
            infoWindow.open(viewModel.map, marker);
        }
    },
    renderBasicInfo: function (name, phone, priceRange) {
        if (!viewModel.currentMarker) {
            return;
        }
        this.formattedInfoContent.basic = '<h4>' + name + '</h4>' +
            '<p>' + "Tel: " + phone + '</p>' +
            '<p>' + "Price Range: " + priceRange + '</p>';
        this.renderInfoWindow();
    },
    renderYelpInfo: function (data) {
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
        this.formattedInfoContent.yelp = formattedString;
        this.renderInfoWindow();
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