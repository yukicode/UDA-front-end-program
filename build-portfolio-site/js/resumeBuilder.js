//resume information
var bio = {
    "name": "XUERU MCMULLAN",
    "role": "WEB DEVELOPER",
    "contacts": {
        "mobile": "XXX-XXX-XXXX",
        "email": "yolandaapply@gmail.com",
        "github": "yukicode",
        "location": "Bellevue, WA",
    },
    "welcomeMessage": "I'm the welcome message I'll disappear in 5s",
    //skills are rendered in graph.svg and displayed in the html
    //generate graph.svg in the terminal using
    //node updateGraph.js
    //due to current file placement the skills array in updateGraph.js has to be mannually updated when skills change
    "skills": [
        "C#",
        "JavaScript",
        ".net",
        "HTML",
        "CSS",
        "NodeJS",
        "C++",
        "Git",
    ],
    "biopic": "./images/logo-s.svg",
};

var education = {
    "schools": [{
        "name": "Rensselaer Polytechnic Institute",
        "location": "Troy, NY",
        "degree": "Ph.D.",
        "majors": ["Chemistry", "AnotherOne", "Third"],
        "dates": "2010-2014",
        "url": "http://www.rpi.edu/",
    }, ],
    "onlineCourses": [{
        "title": "Front-End Web Developer Nanodegree",
        "school": "Udacity",
        "date": "In Progress",
        "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001",
    }, ],
};

var work = {
    "jobs": [{
        "employer": "Rensselaer Polytechnic Institute",
        "title": "Teaching Assistant",
        "location": "Troy, NY",
        "dates": "2010-2012",
        "description": "This is a description",
    }, {
        "employer": "Rensselaer Polytechnic Institute",
        "title": "Research Assistant",
        "location": "Troy, NY",
        "dates": "2013-2014",
        "description": "This is a description",
    }, ],
};

var projects = {
    "projects": [{
        "title": "C# Loader for glTF",
        "dates": "2015",
        "description": 'This is a C# reference loader for glTF. It is as simple to use as Interface.LoadModel("PathToModel.gltf"). You can use this loader in your project by importing the "glTF Loader" NuGet package. Additional examples can be found in the gltfLoaderUnitTests project.',
        "images": ["http://placehold.it/400x200", "http://placehold.it/400x200"],
        "url": "https://github.com/yukicode/glTF",
    }, {
        "title": "Factorio Mod",
        "dates": "2016",
        "description": "Mod for the game Factorio. Created new items in the game. Added backward compatability for the mod.",
        "images": ["http://placehold.it/400x200"],
        "url": "https://github.com/MattMcMullan/BeltUtils",
    }, {
        "title": "Build Portfolio Site",
        "dates": "2016",
        "description": "Mockup a page. Used responsive layouts and images. Added modals to the pages",
        "images": ["http://placehold.it/400x200"],
        "url": "https://github.com/yukicode/u-frontend/tree/master/build-portfolio-site"
    }, ],
};

//helper functions to bind data to the segments and add to html
var appendToHTML = function(property, targetTag, targetHTML, placeholder) {
    var _placeholder = placeholder || "%data%";
    if (property) {
        $(targetTag).append(targetHTML.replace(_placeholder, property));
    }
};

var initToHTML = function(targetTag, targetHTML) {
    $(targetTag).append(targetHTML);
};

//functions that display information to the cooresponding place in the html
bio.display = function() {
    appendToHTML(this.biopic, "#header", HTMLbioPic);
    initToHTML("#header", HTMLtitleStart);
    appendToHTML(this.name, "#title", HTMLtitleName);
    appendToHTML(this.role, "#title", HTMLtitleRole);
    appendToHTML(this.contacts.mobile, "#topContact", HTMLmobile);
    appendToHTML(this.contacts.email, "#topContact", HTMLemail);
    appendToHTML(this.contacts.github, "#topContact", HTMLgithub);
    appendToHTML(this.contacts.location, "#topContact", HTMLlocation);
    appendToHTML(this.contacts.mobile, "#footerContacts", HTMLmobile);
    appendToHTML(this.contacts.email, "#footerContacts", HTMLemail);
    appendToHTML(this.contacts.github, "#footerContacts", HTMLgithub);
    appendToHTML(this.contacts.location, "#footerContacts", HTMLlocation);
    appendToHTML(this.welcomeMessage, "#welcome", HTMLwelcomeMsg);
};

projects.display = function() {
    var index, index2,
        length, length2;
    for (index = 0, length = this.projects.length; index < length; index++) {
        initToHTML("#project", HTMLprojectStart);
        if (this.projects[index].images[0]) {
            var formatImage = HTMLprojectImage.replace("%alt%", "project " + this.projects[index].title + " image 0");
            formatImage = formatImage.replace("%data%", this.projects[index].images[0]);
            $(".project-entry:last").append(formatImage);
        }
        appendToHTML(this.projects[index].title, ".project-entry:last", HTMLprojectTitle);
        appendToHTML(this.projects[index].url, ".project-entry:last", HTMLprojectUrl);
        appendToHTML(this.projects[index].url, ".project-link:last", HTMLprojectUrlTitle);
        //add modal
        //descrpition, all images and dates are displayed in modals
        $(".project-pop:last").attr("data-target", "#project" + index);
        appendToHTML("project" + index, "body", ModalEntry);
        initToHTML(".modal:last", ModalDialogContent);
        initToHTML(".modal-content:last", ModalHeaderStart);
        appendToHTML(this.projects[index].title, ".modal-header:last", ModalHeaderTitle);
        appendToHTML(this.projects[index].dates, ".modal-header:last", ModalHeaderDates);
        initToHTML(".modal-content:last", ModalBodyStart);
        for (index2 = 0, length2 = this.projects[index].images.length; index2 < length2; index2++) {
            if (this.projects[index].images[index2]) {
                var formatModalImage = ModalBodyImage.replace("%alt%", "project " + this.projects[index].title + " image " + index2);
                formatModalImage = formatModalImage.replace("%data%", this.projects[index].images[index2]);
                $(".modal-body:last").append(formatModalImage);
            }
        }
        appendToHTML(this.projects[index].description, ".modal-body:last", ModalBodyDescription);
        initToHTML(".modal-content:last", ModalFooterStart);
        initToHTML(".modal-footer:last", ModalFooterBtnClose);
        appendToHTML(this.projects[index].url, ".modal-footer:last", ModalFooterBtnLink);
    }
};

education.display = function() {
    var index,
        length;
    for (index = 0, length = this.schools.length; index < length; index++) {
        initToHTML("#education", HTMLschoolStart);
        appendToHTML(this.schools[index].name, ".education-entry:last", HTMLschoolName);
        appendToHTML(this.schools[index].degree, ".school-name:last", HTMLschoolDegree);
        appendToHTML(this.schools[index].dates, ".education-entry:last", HTMLschoolDates);
        appendToHTML(this.schools[index].location, ".education-entry:last", HTMLschoolLocation);
        appendToHTML(this.schools[index].majors.join(", "), ".education-entry:last", HTMLschoolMajor);
        $(".education-entry:last a").attr("href", this.schools[index].url);
    }
    for (index = 0, length = this.onlineCourses.length; index < length; index++) {
        initToHTML("#education", HTMLonlineClasses);
        initToHTML("#education", HTMLschoolStart);
        appendToHTML(this.onlineCourses[index].title, ".education-entry:last", HTMLonlineTitle);
        appendToHTML(this.onlineCourses[index].school, ".online-title:last", HTMLonlineSchool);
        appendToHTML(this.onlineCourses[index].date, ".education-entry:last", HTMLonlineDates);
        $(".education-entry:last a").attr("href", this.onlineCourses[index].url);
    }
};

work.display = function() {
    var index,
        length;
    for (index = 0, length = this.jobs.length; index < length; index++) {
        initToHTML("#workExperience", HTMLworkStart);
        appendToHTML(this.jobs[index].employer, ".work-entry:last", HTMLworkEmployer);
        appendToHTML(this.jobs[index].title, ".employer:last", HTMLworkTitle);
        appendToHTML(this.jobs[index].dates, ".work-entry:last", HTMLworkDates);
        appendToHTML(this.jobs[index].location, ".work-entry:last", HTMLworkLocation);
        appendToHTML(this.jobs[index].description, ".work-entry:last", HTMLworkDescription);
    }
};

//display information
bio.display();
education.display();
work.display();
projects.display();

$("#mapDiv").append(googleMap);