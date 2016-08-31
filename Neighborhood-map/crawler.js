var http = require("http");
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//entry point
var entryUrl, pages, entries, url, finishCount = 0, apartments = [];
var id, name, href, webLink, address, priceRange, fullAddress, phone,
    street, city, state, zip;
var dbUrl = "mongodb://localhost:27017/Neighborhood-map", aptDB, collection;

var logCount = 0;

// Use connect method to connect to the server
var connectToDB = function (callback) {
    MongoClient.connect(dbUrl, function (err, db) {
        assert.equal(null, err);
        aptDB = db;
        collection = aptDB.collection('ap-data');
        collection.count(function (err, count) {
            assert.equal(null, err);
            if (count) {
                collection.deleteMany({});
                console.log("deleted the old collection");
            }
        });
        console.log("Connected successfully to server");
        if (callback) {
            callback();
        }
    });
};

//close database
var closeDB = function () {
    aptDB.close();
    console.log("Closed the database");
};

//insert a entry
var insertOneEntry = function (apt, callback) {
    collection.insertOne(apt, function (err, result) {
        assert.equal(err, null);
        logCount++;
        console.log("Inserted a document into the collection", logCount);
        callback(result);
    });
};

//display all the entries
var displayEntries = function (callback) {
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback();
    });
};

//count all the entries
var countEntries = function () {
    collection.count(function (err, count) {
        assert.equal(null, err);
        console.log("total pages:", pages, "total apartments", entries);
        console.log("total entries:", count);
        closeDB();
    });
};

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

function getTotalEntries($) {
    return parseInt($(".total-listings-count").html(), 10);
}

function insertSingleInstance(apt, callback) {
    if (apt && apartments.indexOf(apt.url) < 0) {
        apartments.push(apt.url);
    }
    insertOneEntry(apt, function () {
        callback();
    });
}

//get every apartment's major information on the page'
function getApartmentsOnThePage(i, url) {
    download(url, function (data) {
        if (data) {
            var $$ = cheerio.load(data);
            $$("div.li-srp").each(function (i, e) {
                var apt = {};
                if (e && e.attribs) {
                    apt.id = e.attribs.id;
                } else {
                    apt.id = "";
                }
                if (e && e.children[0] && e.children[0].attribs) {
                    apt.url = "http://www.rent.com" + e.children[0].attribs.href;
                } else {
                    apt.url = "";
                }
                if (e && e.children[3] && e.children[3].children[1] && e.children[3].children[1].children[0] && e.children[3].children[1].children[0].attribs) {
                    apt.name = e.children[3].children[1].children[0].attribs.title;
                } else {
                    apt.name = "";
                }
                if (apt.url) {
                    getDetailOnThePage(apt, function () {
                        insertSingleInstance(apt, function () {
                            finishCount++;
                            if (finishCount === entries) {
                                console.log("finished loading apartment information");
                                collection.count(function (err, count) {
                                    assert.equal(null, err);
                                    console.log("total pages:", pages, "total apartments", entries);
                                    console.log("total entries:", count);
                                    closeDB();
                                });
                            }
                        });
                    });
                }
            });
        }
        else console.log("error in page", url);
    });
}

//get detailed information of every apartment
function getDetailOnThePage(apt, callback) {
    download(apt.url, function (data) {
        var $$$ = cheerio.load(data);
        if ($$$(".pdp-heading-address")[0] && $$$(".pdp-heading-address")[0] && $$$(".pdp-heading-address")[0].children[0] && $$$(".pdp-heading-address")[0].children[0].children[0]) {
            street = $$$(".pdp-heading-address")[0].children[0].children[0].data;
            street = street.substring(0, street.length - 2);
        } else {
            street = "";
        }
        if ($$$(".pdp-heading-address") && $$$(".pdp-heading-address")[0] && $$$(".pdp-heading-address")[0].children[1] && $$$(".pdp-heading-address")[0].children[1].children[0]) {
            city = $$$(".pdp-heading-address")[0].children[1].children[0].data;
            city = city.substring(0, city.length - 2);
        } else {
            city = "";
        }
        if ($$$(".pdp-heading-address") && $$$(".pdp-heading-address")[0] && $$$(".pdp-heading-address")[0].children[3] && $$$(".pdp-heading-address")[0].children[3].children[0]) {
            state = $$$(".pdp-heading-address")[0].children[3].children[0].data;
        } else {
            state = "";
        }
        if ($$$(".pdp-heading-address") && $$$(".pdp-heading-address")[0] && $$$(".pdp-heading-address")[0].children[5] && $$$(".pdp-heading-address")[0].children[5].children[0]) {
            zip = $$$(".pdp-heading-address")[0].children[5].children[0].data;
        } else {
            zip = "";
        }
        fullAddress = street + ", " + city + ", " + state + " " + zip;
        if ($$$(".pdp-heading-meta-rent") && $$$(".pdp-heading-meta-rent")[0] && $$$(".pdp-heading-meta-rent")[0].children[0]) {
            priceRange = $$$(".pdp-heading-meta-rent")[0].children[0].data;
        } else {
            priceRange = "";
        }
        if ($$$(".pdp-heading-meta-phone>a") && $$$(".pdp-heading-meta-phone>a")[0] && $$$(".pdp-heading-meta-phone>a")[0].attribs) {
            phone = $$$(".pdp-heading-meta-phone>a")[0].attribs.href.substring(4);
        } else {
            phone = "";
        }

        apt.priceRange = priceRange;
        apt.fullAddress = fullAddress;
        apt.phone = phone;
        apt.street = street;
        apt.city = city;
        apt.state = state;
        apt.zip = zip;

        callback();
    });
}

function logInfo() {
    console.log(apartments);
}

function init() {
    connectToDB();
    entryUrl = "http://www.rent.com/washington/bellevue/apartments_condos_houses_townhouses";
    download(entryUrl, function (data) {
        if (data) {
            var $ = cheerio.load(data);
            pages = getNumberOfPages($);
            entries = getTotalEntries($);
            for (var i = 1; i <= pages; i++) {
                if (i === 1) {
                    url = entryUrl;
                } else {
                    url = entryUrl + "?page=" + i;
                }
                getApartmentsOnThePage(i, url);
            }
        }
        else console.log("error");
    });
}

init();