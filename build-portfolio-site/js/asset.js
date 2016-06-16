var HTMLtitleStart = '<section id="title" class="col-sm-6 text-right"></section>';
var HTMLtitleName = '<h1>%data%</h1>';
var HTMLtitleRole = '<h3>%data%</h3>';

var HTMLmobile = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Mobile</span><span class="dark-text">%data%</span></li>';
var HTMLemail = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Email</span><span class="dark-text">%data%</span></li>';
var HTMLgithub = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Github</span><span class="dark-text">%data%</span></li>';
var HTMLblog = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Blog</span><span class="dark-text">%data%</span></li>';
var HTMLlocation = '<li class="col-md-3 col-sm-6 text-center"><span class="blue-text">Location</span><span class="dark-text">%data%</span></li>';

var HTMLbioPic = '<figure class="col-sm-6 logo"><img src="%data%" alt="uda-logo"></figure>';
var HTMLwelcomeMsg = '<span class="welcome-message">%data%</span>';

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
var HTMLprojectImage = '<img src="%data%" class="img-responsive center-block project-pop" alt="%alt%">';

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

var googleMap = '<div id="map"></div>';

var bio = {
    "name": "XUERU MCMULLAN",
    "role": "WEB DEVELOPER",
    "contacts": {
        "mobile": "XXX-XXX-XXXX",
        "email": "yolandaapply@gmail.com",
        "github": "yukicode",
        "location": "Bellevue, WA",
    },
    "welcomeMessage": "Hello",
    "skills": [
        "Web Development",
        "C#",
        ".net",
    ],
    "biopic": "./images/logo-s.svg",
};

var education = {
    "schools": [
        {
            "name": "Rensselaer Polytechnic Institute",
            "location": "Troy, NY",
            "degree": "Ph.D.",
            "majors": ["Chemistry"],
            "dates": "2010-2014",
            "url": "http://www.rpi.edu/",
        },
    ],
    "onlineCourses": [
        {
            "title": "Front-End Web Developer Nanodegree",
            "school": "Udacity",
            "date":"In Progress",
            "url":"https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001",
        },
    ],
};

var work = {
    "jobs":[
        {
            "employer": "Rensselaer Polytechnic Institute",
            "title": "Teaching Assistant",
            "location": "Troy, NY",
            "dates": "2010-2012",
            "description":"This is a description",
        }, 
        {
            "employer": "Rensselaer Polytechnic Institute",
            "title": "Research Assistant",
            "location": "Troy, NY",
            "dates": "2013-2014",
            "description": "This is a description",
        },
    ],
};

var projects = {
    "projects": [
        {
            "title": "C# Loader for glTF",
            "dates": "",
            "description": 'This is a C# reference loader for glTF. It is as simple to use as Interface.LoadModel("PathToModel.gltf"). You can use this loader in your project by importing the "glTF Loader" NuGet package. Additional examples can be found in the gltfLoaderUnitTests project.',
            "images": ["http://placehold.it/400x200"],
            "url": "https://github.com/KhronosGroup/glTF/tree/master/loaders/CSharp",
        },
        {
            "title": "Factorio Mod",
            "dates": "",
            "description": "Mod for the game Factorio. Created new items in the game. Added backward compatability for the mod.",
            "images": ["http://placehold.it/400x200"],
            "url": "https://github.com/MattMcMullan/BeltUtils", 
        },
        {
            "title": "Build Portfolio Site",
            "dates": "",
            "description": "Mockup a page. Used responsive layouts and images. Added modals to the pages",
            "images": ["http://placehold.it/400x200"],
            "url": "https://github.com/yukicode/u-frontend/tree/master/build-portfolio-site"
        },
    ],
};

