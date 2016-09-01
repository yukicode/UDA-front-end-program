var https = require('https');
var cheerio = require("cheerio");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

var dbUrl = "mongodb://localhost:27017/Neighborhood-map", aptDB, collection;
var baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB-GSn-FrlOEQIwVeIhp6A2224jr6kTFoY";
var street, city, state, address, secondUrl, finalUrl, loc, placeId, totalEntries, countUpdate = 0;
var tempArray = [];

// Use connect method to connect to the server
var connectToDB = function (callback) {
    MongoClient.connect(dbUrl, function (err, db) {
        assert.equal(null, err);
        aptDB = db;
        collection = aptDB.collection('ap-data');
        console.log("Connected successfully to server");
        if (callback) {
            callback();
        }
    });
};

// download a URL and invoke callback with the data.
var download = function (url, callback) {
    https.get(url, function (res) {
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
};

var getCoordination = function (apt, callback) {
    address = apt.fullAddress;
    secondUrl = address.split(" ").join("+");
    finalUrl = baseUrl + "&address=" + secondUrl;
    download(finalUrl, function (data) {
        parsedData = JSON.parse(data);
        if (parsedData.results[0]) {
            loc = parsedData.results[0].geometry.location;
            placeId = parsedData.results[0].place_id;
        } else {
            loc = "";
            placeId = "";
            console.log("Did not get results for ", apt.name, apt.id);
        }
        if (callback) { callback({ "loc": loc, "placeId": placeId }); }
    });
};

var getTotalEntries = function (callback) {
    collection.count(function (err, count) {
        assert.equal(null, err);
        totalEntries = count;
        if (callback) { callback(); }
    });
};

var updateGeoLocation = function () {
    MongoClient.connect(dbUrl, function (err, db) {
        assert.equal(null, err);
        aptDB = db;
        collection = aptDB.collection('ap-data');
        console.log("Connected successfully to server");
        getTotalEntries(function () {
            collection.find({}).toArray(function (err, apts) {
                assert.equal(err, null);
                var i = 0;
                var timer = setInterval(function () {
                    var apt = apts[i++];
                    if (!apt.loc) {
                        getCoordination(apt, function (data) {
                            collection.updateOne({ _id: apt._id }, { $set: { loc: data.loc, placeId: data.placeId } }, function () {
                                console.log("updated entry", apt.name, apt.id, ++countUpdate);
                            });
                        });
                    } else {
                        console.log("loc already exist", countUpdate);
                        ++countUpdate;
                    }
                    if (!apts[i]) {
                        clearInterval(timer);
                        console.log("finished updating", i);
                    }
                }, 300);
            });
        });
    });
}

//save entries to file
var saveEntries = function () {
    MongoClient.connect(dbUrl, function (err, db) {
        assert.equal(null, err);
        aptDB = db;
        collection = aptDB.collection('ap-data');
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            docs.forEach(function (doc) {
                if (doc.name && doc.loc) {
                    tempArray.push({name: doc.name, loc: doc.loc, fullAddress: doc.fullAddress, priceRange: doc.priceRange, phone: doc.phone});
                    console.log("added ", doc.name);
                }
            });
            tempArray = JSON.stringify(tempArray);
            fs.writeFile("./js/aptData.js", tempArray, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Successfully output to file");
                aptDB.close();
            });
        });
    });
};

saveEntries();
