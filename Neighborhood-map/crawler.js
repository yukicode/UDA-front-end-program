var http = require("http");
var cheerio = require("cheerio");

//entry point
var entryUrl, pages, url, finishCount = 0;
var apartments = [];
var id, name, href, webLink, address, priceRange, fullAddress, phone;
var street, city, state, zip;
function pushSingleInstance(apt) {
    if (!apt || apartments.indexOf(apt) >= 0) { return; }
    apartments.push(apt);
}
// download a URL and invoke callback with the data.
function download(url, callback) {
    http.get(url, function (res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            callback(data);
        });
    }).on("error", function () {
        callback(null);
    });
}

//get the number of pages that needs to collect
function getNumberOfPages($) {
    return Math.ceil($(".total-listings-count").html() / 20);
}

//get every apartment's major information on the page'
function getApartmentsOnThePage(i, url) {
    download(url, function (data) {
        if (data) {
            var $$ = cheerio.load(data);
            $$("div.li-srp").each(function (i, e) {
                id = e.attribs.id || '';
                href = "http://www.rent.com" + e.children[0].attribs.href || '';
                name = e.children[3].children[1].children[0].attribs.title || '';
                pushSingleInstance({ "id": id, "name": name, "url": href, });
            });
            finishCount++;
            if(finishCount === pages){
                getDetailOnThePage();
            }
        }
        else console.log("error in page", url);
    });
}

//get detailed information of every apartment
function getDetailOnThePage(){
    /*
    apartments.forEach(function(apt){
        download(apt.url, function(data){
            var $$$ = cheerio.load(data);

            street = $$$(".pdp-heading-address")[0].children[0].children[0].data;
            street = street.substring(0, street.length-2);
            city = $$$(".pdp-heading-address")[0].children[1].children[0].data;
            city = city.substring(0, city.length-2);
            state = $$$(".pdp-heading-address")[0].children[3].children[0].data;
            zip = $$$(".pdp-heading-address")[0].children[5].children[0].data;
            fullAddress = street + ", " + city + ", " + state + " " + zip;
            priceRange = $$$(".pdp-heading-meta-rent")[0].children[0].data;

            apt.priceRange = priceRange;
            apt.fullAddress = fullAddress;
            apt.street = street;
            apt.city = city;
            apt.state = state;
            apt.zip = zip;
        });
    });
    */
    download(apartments[1].url, function(data){
        var $$$ = cheerio.load(data);
        var apt = apartments[1];
        street = $$$(".pdp-heading-address")[0].children[0].children[0].data;
        street = street.substring(0, street.length-2);
        city = $$$(".pdp-heading-address")[0].children[1].children[0].data;
        city = city.substring(0, city.length-2);
        state = $$$(".pdp-heading-address")[0].children[3].children[0].data;
        zip = $$$(".pdp-heading-address")[0].children[5].children[0].data;
        fullAddress = street + ", " + city + ", " + state + " " + zip;
        priceRange = $$$(".pdp-heading-meta-rent")[0].children[0].data;
        phone = $$$(".pdp-heading-meta-phone>a")[0].attribs.href.substring(4);
        apt.priceRange = priceRange;
        apt.fullAddress = fullAddress;
        apt.phone = phone;
        apt.street = street;
        apt.city = city;
        apt.state = state;
        apt.zip = zip;

        console.log(phone);
    });
}

function logInfo(){
    console.log(apartments);
}

function init() {
    entryUrl = "http://www.rent.com/washington/bellevue/apartments_condos_houses_townhouses";
    download(entryUrl, function (data) {
        if (data) {
            var $ = cheerio.load(data);
            pages = getNumberOfPages($);
            for (var i = 1; i <= pages; i++) {
                if(i===1){
                    url = entryUrl;
                }else{
                    url = entryUrl + "?page=" + i;
                }
                getApartmentsOnThePage(i, url);
            }
        }
        else console.log("error");
    });
}

init();