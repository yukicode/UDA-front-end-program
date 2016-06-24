var appendToHTML = function(property, targetTag, targetHTML, placeholder){
    var _placeholder = placeholder || "%data%";
    if(property){
        $(targetTag).append(targetHTML.replace(_placeholder, property));
    }
};

var prependToHTML = function(property, targetTag, targetHTML, placeholder){
    var _placeholder = placeholder || "%data%";
    if(property){
        $(targetTag).prepend(targetHTML.replace(_placeholder, property));
    }
};

var initToHTML = function(targetTag, targetHTML){
    $(targetTag).append(targetHTML);
};

bio.display = function(){
    var index,
        length;
    appendToHTML(this.biopic, "#header", HTMLbioPic);
    initToHTML("#header", HTMLtitleStart);
    appendToHTML(this.name, "#title", HTMLtitleName);
    appendToHTML(this.role, "#title", HTMLtitleRole);
    appendToHTML(this.contacts.mobile, "#contact", HTMLmobile);
    appendToHTML(this.contacts.email, "#contact", HTMLemail);
    appendToHTML(this.contacts.github, "#contact", HTMLgithub);
    appendToHTML(this.contacts.location, "#contact", HTMLlocation);
    appendToHTML(this.contacts.mobile, "#footerContacts", HTMLmobile);
    appendToHTML(this.contacts.email, "#footerContacts", HTMLemail);
    appendToHTML(this.contacts.github, "#footerContacts", HTMLgithub);
    appendToHTML(this.contacts.location, "#footerContacts", HTMLlocation);
};

projects.display = function(){
    var index, index2,
        length, length2;
    for(index=0, length = this.projects.length; index < length; index++){
        initToHTML("#project", HTMLprojectStart);
        for(index2=0, length2 = this.projects[index].images.length; index2 < length2; index2++){
            appendToHTML(this.projects[index].images[index2], ".project-entry:last", HTMLprojectImage);
        }
        appendToHTML(this.projects[index].title, ".project-entry:last", HTMLprojectTitle);
        appendToHTML(this.projects[index].url, ".project-entry:last", HTMLprojectUrl);
        appendToHTML(this.projects[index].url, ".project-link:last", HTMLprojectUrlTitle)

        $(".project-pop:last").attr("data-target", "#project"+index);
        appendToHTML("project"+index, "body", ModalEntry);
        initToHTML(".modal:last", ModalDialogContent);
        initToHTML(".modal-content:last", ModalHeaderStart);
        appendToHTML(this.projects[index].title, ".modal-header:last", ModalHeaderTitle);
        appendToHTML(this.projects[index].dates, ".modal-header:last", ModalHeaderDates);
        initToHTML(".modal-content:last",ModalBodyStart);
        for(index2=0, length2 = this.projects[index].images.length; index2 < length2; index2++){
            appendToHTML(this.projects[index].images[index2], ".modal-body:last", ModalBodyImage);
        }
        appendToHTML(this.projects[index].description, ".modal-body:last", ModalBodyDescription);
        initToHTML(".modal-content:last",ModalFooterStart);
        initToHTML(".modal-footer:last",ModalFooterBtnClose);
        appendToHTML(this.projects[index].url, ".modal-footer:last", ModalFooterBtnLink);
    }
};

education.display = function(){
    var index,
        length;
    for(index=0, length = this.schools.length; index < length; index++){
        initToHTML("#education", HTMLschoolStart);
        appendToHTML(this.schools[index].name, ".education-entry:last", HTMLschoolName);
        appendToHTML(this.schools[index].degree, ".school-name:last", HTMLschoolDegree);
        appendToHTML(this.schools[index].dates, ".education-entry:last", HTMLschoolDates);
        appendToHTML(this.schools[index].location, ".education-entry:last", HTMLschoolLocation);
        appendToHTML(this.schools[index].majors[0], ".education-entry:last", HTMLschoolMajor);
        $(".education-entry:last a").attr("href", this.schools[index].url);
    }
    for(index=0, length = this.onlineCourses.length; index < length; index++){
        initToHTML("#education", HTMLonlineClasses);
        initToHTML("#education", HTMLschoolStart);
        appendToHTML(this.onlineCourses[index].title, ".education-entry:last", HTMLonlineTitle);
        appendToHTML(this.onlineCourses[index].school, ".online-title:last", HTMLonlineSchool);
        appendToHTML(this.onlineCourses[index].date, ".education-entry:last", HTMLonlineDates);
        $(".education-entry:last a").attr("href", this.onlineCourses[index].url);
    }
};

work.display = function(){
    var index,
        length;
    for(index=0, length = this.jobs.length; index < length; index++){
        initToHTML("#workExperience", HTMLworkStart);
        appendToHTML(this.jobs[index].employer, ".work-entry:last", HTMLworkEmployer);
        appendToHTML(this.jobs[index].title, ".employer:last", HTMLworkTitle);
        appendToHTML(this.jobs[index].dates, ".work-entry:last", HTMLworkDates);
        appendToHTML(this.jobs[index].location, ".work-entry:last", HTMLworkLocation);
        appendToHTML(this.jobs[index].description, ".work-entry:last", HTMLworkDescription);
    }
};

bio.display();
education.display();
work.display();
projects.display();
