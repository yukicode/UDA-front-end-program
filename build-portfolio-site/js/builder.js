 var bio_contactMapToHTML = [
     bio.contacts,
     ["properties", ["email", "github", "location"], "#contact", [myHTML.contactEmail, myHTML.contactGithub, myHTML.contactLocation]],
 ];

var bioMapToHTML = [
    bio,
    ["properties", ["biopic"], "#header", [myHTML.logo]],
    ["start", "", "#header", myHTML.title],
    ["properties", ["name", "role"], "#title", [myHTML.titleName, myHTML.titleRole]],
    ["obj|objArray", bio_contactMapToHTML],
];

var pro_projectsMapToHTML = [
    projects.projects,
    ["start", "", "#project", myHTML.projectStart],
    ["start", "", ".project-description:last", myHTML.projectImage],
    ["properties", ["title", "url"], ".project-description:last", [myHTML.projectTitle, myHTML.projectUrl]],
];
var projectsMapToHTML = [
    projects,
    ["obj|objArray", pro_projectsMapToHTML],
]


var loadObjectToHTML = function(objMapToHTML){
    var obj = objMapToHTML[0],
        objCount;
    if(obj instanceof Array){ //obj is an array of objects
        objCount = obj.length;
        for(var index=0; index < objCount; index++){
            loadPropertyToHTML(objMapToHTML, obj[index]);
        }
    }else{
        loadPropertyToHTML(objMapToHTML, obj);
    }
};

var loadPropertyToHTML = function(objMapToHTML, obj){
    var flag,
        property,
        propertyName,
        targetTag,
        propertyHTML,
        propertyCount,
        objMapToHTMLLength = objMapToHTML.length;

    if(objMapToHTMLLength < 1) return;
    for(var index1 = 1; index1 < objMapToHTMLLength; index1++){
        flag = objMapToHTML[index1][0];
        propertyName = objMapToHTML[index1][1];
        //if key-->an object or object array
        if(flag == "obj|objArray"){
            loadObjectToHTML(propertyName);
        }else{
            if(objMapToHTML[index1].length !== 4) {
                console.log("The length of the schema is incorrect " + objMapToHTML[index1]);
                return;
            }
            targetTag = objMapToHTML[index1][2];
            propertyHTML = objMapToHTML[index1][3];
            if(flag === "properties"){ // keys --> values
                propertyCount = propertyName.length;
                for(var index2 = 0; index2 < propertyCount; index2++){
                    property = obj[propertyName[index2]];
                    if(property){
                        $(targetTag).append(propertyHTML[index2].replace("%data%", property));
                    }
                }
            }else if(flag === "start"){ //if this is the start of a new sectiion
                $(targetTag).append(propertyHTML);
            }else if(flag === "array"){ //if it is an array of values
                propertyCount = obj[propertyName].length;
                for(var index3 = 0; index3 < propertyCount; index3++){
                    property = obj[propertyName][index3];
                    if(property){
                        $(targetTag).append(propertyHTML.replace("%data%", property));
                    }
                }
            }else{
                console.log("incorrect schema!" + objMapToHTML[index1]);
                return;
            }
        }
    }
};

bio.display();
projects.display();