//TODO handle networkerror for yelp

//property and map data
var model = {
    aptList: apts,
    aptMarkerList: [],
    sidebarList: ko.observableArray([]),
    defaultLoc: { lat: 47.610377, lng: -122.200679 },
    defaultZoom: 12,
};

var viewModel = {
    init: function () {
        var self = this;
        view.init();
        this.setMap();
        this.setMapBounds();
        this.setInfoWindow();
        this.setAptMarkers(100);
        this.currentMarker = null;
        this.applyBinding();
    },
    applyBinding: function () {
        var self = this;
        this.bindData = {
            sidebarList: model.sidebarList,
            display: function (apt) {
                self.currentMarker = model.aptMarkerList[apt.index];
                self.updateInfoWindow();
            },
            searchTerm: ko.observable(""),
            filter: function () {
                self.filterName();
            },
        };
        ko.applyBindings(self.bindData);
    },
    setMap: function () {
        this.map = new google.maps.Map(view.mapDiv, {
            center: model.defaultLoc,
            zoom: model.defaultZoom,
        });
    },
    setMapBounds: function () {
        this.bounds = new google.maps.LatLngBounds();
    },
    setWorkMarker: function (loc) {
        if (!this.map) { return; }
        this.workMarker = new google.maps.Marker({
            position: loc,
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
                compactTitle: model.aptList[i].name.split(" ").join("").split("'").join("").toLowerCase(),
                aptIndex: i,
                show: true,
            });
            model.aptMarkerList.push(marker);
            model.sidebarList.push({ title: model.aptList[i].name, index: i });
            view.renderMarker(marker);
        }
    },
    setInfoWindow: function () {
        this.infoWin = new google.maps.InfoWindow({ marker: null });
    },
    updateInfoWindow: function () {
        this.updateBasicInfo();
        this.updateYelpInfo();
        this.updateGoogleInfo();
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
            lat = model.aptList[i].loc.lat || 0,
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
                view.renderYelpInfo({ error: "Not Found" });
            } else {
                view.renderYelpInfo(data);
            }
        }).fail(function (err) {
            view.renderYelpInfo({ error: "Unable to Connect" });
        });
    },
    updateGoogleInfo: function () {
        var self = this;
        var marker = this.currentMarker;
        if (!marker) { return; }
        var i = marker.aptIndex,
            name = model.aptList[i].name,
            lat = model.aptList[i].loc.lat || 0,
            lng = model.aptList[i].loc.lng || 0;
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/api/google/",
            data: {
                lat: lat,
                lng: lng,
                name: name,
            }
        }).done(function (data) {
            if (data.message) { //if the data comes with a message, then there is an error getting data from yelp
                console.log("error needs to be handled", data.message);
                view.renderGoogleInfo({ error: "Not Found" });
            } else {
                view.renderGoogleInfo(data);
            }
        }).fail(function (err) {
            view.renderGoogleInfo({ error: "Unable to Connect" });
        });
    },
    filterName: function () {
        var self = this;
        var searchTerm = this.bindData.searchTerm().trim();
        model.sidebarList.removeAll();
        this.setMapBounds();
        if (this.workMarker) {
            view.renderBounds(this.workMarker);
        }
        model.aptMarkerList.forEach(function (marker) {
            marker.show = true;
            if (self.workMarker && (self.distance(self.workMarker.position, marker.position) > 0.003)) {
                marker.show = false;
            }
            if (searchTerm && marker.compactTitle.indexOf(searchTerm) === -1) {
                marker.show = false;
            }
            if (marker.show === true) {
                model.sidebarList.push({ title: marker.title, index: marker.aptIndex });
            }
            view.toggleMarker(marker);
        });
    },
    distance: function (loc1, loc2) {
        var x = loc1.lat() - loc2.lat();
        var y = loc1.lng() - loc2.lng();
        return x * x + y * y;
    },
};

var view = {
    init: function () {
        this.mapDiv = document.getElementById("map");
        this.workForm = document.getElementById("work-loc");
        this.setAutoComplete();
        this.formattedInfoContent = {
            start: '<div id="content">',
            end: '</div>',
            title: '',
            basic: '',
            yelp: '<p>' + 'Yelp Review: Loading...' + '</p>',
            google: '<p>' + 'Google Review: Loading...' + '</p>',
            img: '',
        };
    },
    renderMarker: function (marker) {
        var self = this;
        if (!viewModel.map || !marker) { return; }
        marker.setMap(viewModel.map);
        this.renderBounds(marker);
        marker.addListener('click', function () {
            self.formattedInfoContent = {
                start: '<div id="content">',
                end: '</div>',
                title: '',
                basic: '',
                yelp: '<p>' + 'Yelp Review: Loading...' + '</p>',
                google: '<p>' + 'Google Review: Loading...' + '</p>',
                img: '',
            };
            viewModel.currentMarker = marker;
            viewModel.updateInfoWindow();
        });
    },
    toggleMarker: function (marker) {
        if (marker.show === false) {
            marker.setMap(null);
        } else {
            this.renderBounds(marker);
            marker.setMap(viewModel.map);
        }
    },
    renderBounds: function (marker) {
        viewModel.bounds.extend(marker.position);
        viewModel.map.fitBounds(viewModel.bounds);
    },
    renderInfoWindow: function () {
        var infoWindow = viewModel.infoWin,
            marker = viewModel.currentMarker,
            content = this.formattedInfoContent.start +
                this.formattedInfoContent.title +
                this.formattedInfoContent.basic +
                this.formattedInfoContent.yelp +
                this.formattedInfoContent.google +
                this.formattedInfoContent.end;
        if (this.formattedInfoContent.img) {
            content = this.formattedInfoContent.img + content;
        }
        content = '<div class="flex">' + content + '</div>';
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
        this.formattedInfoContent.title = '<h4>' + name + '</h4>';
        this.formattedInfoContent.basic = '<p>' + "Tel: " + this.formatPhone(phone) + '</p>' +
            '<p>' + "Price Range: " + priceRange + '</p>';
        this.renderInfoWindow();
    },
    renderYelpInfo: function (data) {
        if (data.error) {
            this.formattedInfoContent.yelp = '<p>' + 'Yelp Review: ' + data.error + '</p>';
            this.renderInfoWindow();
            return;
        }
        var formattedString = '',
            rating, ratingImg, ratingCount, yelpLink, yelpImage, yelpSnippet;

        rating = data.rating || 0;
        ratingImg = this.getRatingImg(rating);
        ratingCount = data.review_count || 0;
        yelpLink = data.url || "";
        yelpImage = data.image_url || "";
        if (yelpImage) {
            this.formatImage(yelpImage);
        }
        yelpSnippet = data.snippet_text || "";
        formattedString = '<a href="' + yelpLink + '" target="_blank">' + '<p>' + "Yelp Review: " + rating + ratingImg + '(' + ratingCount + ')' + '</p>' + '</a>';
        this.formattedInfoContent.yelp = formattedString;
        this.renderInfoWindow();
    },
    renderGoogleInfo: function (data) {
        if (data.error) {
            this.formattedInfoContent.google = '<p>' + 'Google Review: ' + data.error + '</p>';
            this.renderInfoWindow();
            return;
        }
        var formattedString = '',
            rating, ratingImg, ratingCount, googleLink, webAddress;

        rating = data.rating || 0;
        ratingImg = this.getRatingImg(rating);
        ratingCount = data.reviews ? data.reviews.length : 0;
        googleLink = data.url || "";
        webAddress = data.website || "";
        if (ratingCount >= 5) {
            ratingCount = ">5";
        }
        formattedString = '<a href="' + googleLink + '" target="_blank">' + '<p>' + "Google Review: " + rating + ratingImg + '(' + ratingCount + ')' + '</p>' + '</a>';
        this.formattedInfoContent.google = formattedString;
        if (webAddress) {
            this.formattedInfoContent.title = '<a href="' + webAddress + '" target="_blank">' + this.formattedInfoContent.title + '</a>';
        }
        this.renderInfoWindow();
    },
    getRatingImg: function (rating) {
        var fullStar = "&#9733;",
            halfStar = "&#10030;",
            emptyStar = "&#9734;";
        if (rating === 0) {
            return emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;
        } else if (rating <= 1) {
            return halfStar + emptyStar + emptyStar + emptyStar + emptyStar;
        } else if (rating === 1) {
            return fullStar + emptyStar + emptyStar + emptyStar + emptyStar;
        } else if (rating < 2) {
            return fullStar + halfStar + emptyStar + emptyStar + emptyStar;
        } else if (rating === 2) {
            return fullStar + fullStar + emptyStar + emptyStar + emptyStar;
        } else if (rating < 3) {
            return fullStar + fullStar + halfStar + emptyStar + emptyStar;
        } else if (rating === 3) {
            return fullStar + fullStar + fullStar + emptyStar + emptyStar;
        } else if (rating < 4) {
            return fullStar + fullStar + fullStar + halfStar + emptyStar;
        } else if (rating === 4) {
            return fullStar + fullStar + fullStar + fullStar + emptyStar;
        } else if (rating < 5) {
            return fullStar + fullStar + fullStar + fullStar + halfStar;
        } else {
            return fullStar + fullStar + fullStar + fullStar + fullStar;
        }
    },
    formatPhone: function (phone) {
        if (phone.length === 11 && phone[0] === 1) {
            return ' (' + phone.substring(1, 4) + ') ' + phone.substring(4, 7) + '-' + phone.substring(7);
        } else if (phone.length === 10) {
            return ' (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
        }
    },
    formatImage: function (img) {
        this.formattedInfoContent.img = '<div id="image">' + '<img src="' + img + '">' + '</div>';
    },
    setAutoComplete: function () {
        var self = this;
        this.autocomplete = new google.maps.places.Autocomplete(self.workForm, {
            options: ['address'],
            componentRestrictions: { country: 'us' }
        });
        this.autocomplete.addListener('place_changed', function () {
            var place = self.autocomplete.getPlace();
            if (place.geometry) {
                viewModel.setWorkMarker(place.geometry.location);
                viewModel.map.panTo(place.geometry.location);
            } else {
                viewModel.workMarker = null;
                self.workForm.placeholder = 'Enter a location';
            }
        });
    },
};