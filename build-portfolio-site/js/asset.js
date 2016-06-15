var myHTML = {
    logo: '<figure class="col-sm-6 logo"><img src="%data%" alt="uda-logo"></figure>',
    title: '<section id="title" class="col-sm-6 text-right"></section>',
    titleName: '<h1>%data%</h1>',
    titleRole: '<h3>%data%</h3>',
    contactEmail: '<li class="col-sm-4"><span>EMAIL: </span><span>%data%</span></li>',
    contactGithub: '<li class="col-sm-4"><span>GITHUB: </span><span>%data%</span></li>',
    contactLocation: '<li class="col-sm-4"><span>LOCATION: </span><span>%data%</span></li>',
    projectStart: '<figure class="project-description col-sm-6 col-lg-4" ></figure>',
    projectImage: '<img src="http://placehold.it/400x200" class="img-responsive center-block project-pop" alt="%alt%">',
    projectTitle: '<p class="text-400 text-center">%data%</p>',
    projectUrl: '<p class="text-center project-link"><a href="%data%">%URL%</a></p>',
    projectDescription: "",

}

var bio = {
    "name": "XUERU MCMULLAN",
    "role": "WEB DEVELOPER",
    "contacts": {
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
    "display": function(){ return loadObjectToHTML(bioMapToHTML); },
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
    "display": function(){ return loadObjectToHTML(educationMapToHTML);},
};

var work = {
    "jobs":[
        {
            "employer": "RPI",
            "title": "Teaching Assistant",
            "location": "Troy, NY",
            "dates": "2010-2012",
            "description":"",
        }, 
        {
            "employer": "RPI",
            "title": "Research Assistant",
            "location": "Troy, NY",
            "dates": "2013-2014",
            "description": "",
        },
    ],
    display: function(){ return loadObjectToHTML(workMapToHTML);},
};

var projects = {
    "projects": [
        {
            "title": "C# loader for glTF",
            "dates": "",
            "description": 'This is a C# reference loader for glTF. It is as simple to use as Interface.LoadModel("PathToModel.gltf"). You can use this loader in your project by importing the "glTF Loader" NuGet package. Additional examples can be found in the gltfLoaderUnitTests project.',
            "images": [],
            "url": "https://github.com/KhronosGroup/glTF/tree/master/loaders/CSharp",
        },
        {
            "title": "Factorio Mod",
            "dates": "",
            "description": "Mod for the game Factorio. Created new items in the game. Added backward compatability for the mod.",
            "images": [],
            "url": "https://github.com/MattMcMullan/BeltUtils", 
        },
        {
            "title": "Build portfolio site",
            "dates": "",
            "description": "Mockup a page. Used responsive layouts and images. Added modals to the pages",
            "images": [],
            "url": "https://github.com/yukicode/u-frontend/tree/master/build-portfolio-site"
        },
    ],
    "display": function(){ return loadObjectToHTML(projectsMapToHTML);},
};

