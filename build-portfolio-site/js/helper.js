//html segmentst to be added to the html
//variables have been modified or added for customization
var HTMLtitleStart = '<section id="title" class="col-sm-6 text-right"></section>';
var HTMLtitleName = '<h1>%data%</h1>';
var HTMLtitleRole = '<h3>%data%</h3>';

var HTMLmobile = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Mobile</span><span class="dark-text">%data%</span></li>';
var HTMLemail = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Email</span><span class="dark-text">%data%</span></li>';
var HTMLgithub = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Github</span><span class="dark-text">%data%</span></li>';
var HTMLblog = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Blog</span><span class="dark-text">%data%</span></li>';
var HTMLlocation = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Location</span><span class="dark-text">%data%</span></li>';

var HTMLbioPic = '<figure class="col-sm-6 logo"><img src="%data%" alt="logo"></figure>';
var HTMLwelcomeMsg = '<h5 class="col-sm-12 text-center text-light-color" id="welcome-message">%data%</h5>';

var HTMLskillsStart = '<h3 id="skills-h3">Skills at a Glance:</h3><ul id="skills" class="flex-box"></ul>';
var HTMLskills = '<li class="flex-item"><span class="dark-text">%data%</span></li>';

var HTMLworkStart = '<div class="work-entry"></div>';
var HTMLworkEmployer = '<a href="#" class="col-sm-12 employer">%data%</a>';
var HTMLworkTitle = '<span>-- %data%</span>';
var HTMLworkDates = '<div class="date-text col-xs-6">%data%</div>';
var HTMLworkLocation = '<div class="location-text col-xs-6 text-right">%data%</div>';
var HTMLworkDescription = '<div class="col-xs-12">%data%</div>';

var HTMLprojectStart = '<div class="project-entry col-sm-6 col-lg-4"></div>';
var HTMLprojectTitle = '<p class="text-400 text-center">%data%</p>';
var HTMLprojectDates = '<div class="date-text">%data%</div>';
var HTMLprojectUrl = '<a href="%data%" class="text-center project-link ellipsis"></a>';
var HTMLprojectUrlTitle = '%data%';
var HTMLprojectDescription = '';
var HTMLprojectImage = '<img src="%data%" class="img-responsive center-block project-pop" alt="%alt%" data-toggle="modal" data-target="%modal%">';

var HTMLschoolStart = '<div class="education-entry"></div>';
var HTMLschoolName = '<a href="#" class="col-sm-12 school-name">%data%</a>';
var HTMLschoolDegree = '<span>-- %data%</span>';
var HTMLschoolDates = '<div class="date-text col-xs-6">%data%</div>';
var HTMLschoolLocation = '<div class="location-text col-xs-6 text-right">%data%</div>';
var HTMLschoolMajor = '<em class="col-sm-12">Major: %data%</em>';

var HTMLonlineClasses = '<h3 class="col-sm-12 text-light-color">Online Classes</h3>';
var HTMLonlineTitle = '<a href="#" class="col-sm-12 online-title">%data%</a>';
var HTMLonlineSchool = '<span>-- %data%</span>';
var HTMLonlineDates = '<div class="date-text col-sm-12">%data%</div>';
var HTMLonlineURL = '<br><a href="#">%data%</a>';

var googleMap = '<div class="col-sm-12" id="map"></div>';

var ModalEntry = '<div class="modal fade" id="%data%" tabindex="-1" role="dialog"></div>';
var ModalDialogContent = '<div class="modal-dialog"><div class="modal-content"></div></div>';
var ModalHeaderStart = '<div class="modal-header"></div>';
var ModalHeaderTitle = '<h4 class="modal-title col-xs-8">%data%</h4>';
var ModalHeaderDates = '<span class="col-xs-4 text-right date-text"> -- %data%</span>';
var ModalBodyStart = '<div class="modal-body"></div>';
var ModalBodyImage = '<img class="img-responsive center-block modal-img" src="%data%" alt="%alt%">';
var ModalBodyDescription = '<p>%data%</p>';
var ModalFooterStart = '<div class="modal-footer"></div>';
var ModalFooterBtnClose = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
var ModalFooterBtnLink = '<a href="%data%" class="btn btn-primary" role="button">Go to Project</button>';

/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
var map;    // declares a global map variable


/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  /* 
  For the map to be displayed, the googleMap var must be
  appended to #mapDiv in resumeBuilder.js. 
  */
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an empty array
    var locations = [];

    // adds the single location property from bio to the locations array
    locations.push(bio.contacts.location);

    // iterates through school locations and appends each location to
    // the locations array. Note that forEach is used for array iteration
    // as described in the Udacity FEND Style Guide: 
    // https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html#for-in-loop
    education.schools.forEach(function(school){
      locations.push(school.location);
    });

    // iterates through work locations and appends each location to
    // the locations array. Note that forEach is used for array iteration
    // as described in the Udacity FEND Style Guide: 
    // https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html#for-in-loop
    work.jobs.forEach(function(job){
      locations.push(job.location);
    });

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
      locations.forEach(function(place){
      // the search request object
      var request = {
        query: place
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    });
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}



//Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

//Vanilla JS way to listen for resizing of the window
//and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
 map.fitBounds(mapBounds);
});
