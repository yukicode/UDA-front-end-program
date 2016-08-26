var http = require("http");
var cheerio = require("cheerio");

//entry point
var url = "http://www.rent.com/washington/bellevue/apartments_condos_houses_townhouses";
var apartments = [];
var id, name, href, webLink, priceRange;

function pushSingleInstance(apartments, apt){
    if(!apt || apartments.indexOf(apt) >=0 ){return;}
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

download(url, function (data) {
    if (data) {
        var $ = cheerio.load(data);
        $("div.li-srp").each(function (i, e) {
            id = e.attribs.id || '';
            href = e.children[4].attribs.href || '';
            name = e.children[3].children[1].children[0].attribs.title || '';
            pushSingleInstance(apartments, {"id": id, "name": name, "url": url, });
        });
    }
    else console.log("error");
});