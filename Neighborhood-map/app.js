var express = require("express");
var path = require("path");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var root = __dirname;
var port = 3000;
var Yelp = require("yelp");

var yelp = new Yelp({
    consumer_key: '5CCHrMKMKv4Qn9fJFD-VXw',
    consumer_secret: 'tvbHArqGjwctNkKvgy7tw0jMiso',
    token: 'm-vZLefH-jMbjJ2F04BakYejDcPiP8OE',
    token_secret: 'eYB5IAG_1t3mUhW7ClmKkldLrPw',
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(root));

app.get('/', function (req, res) {
    res.sendFile(path.join(root + "/index.html"));
});

app.get('/api/yelp/', function (req, res) {
    if (!req.query.lat || !req.query.lng) {
        res.send({ message: "Invalid query, missing parameters lat/lng" });
    }
    if(!req.query.term){
        res.send({ message: "Invalid query, missing parameter term" });
    }
    var lat = req.query.lat,
        lng = req.query.lng,
        term = req.query.term,
        limit = req.query.limit || 1;

    yelp.search({ term: term, ll: lat + "," + lng, })
        .then(function (data) {
            if(data.total){
                data.businesses.forEach(function(r){
                    if(r.categories && r.categories[0][0].toLowerCase() === "apartments"){
                        res.send(r);
                    }
                });
                res.send({message: "Apartment not found", data: data.businesses[0],});
            }
            else{
                res.send({message: "No result found"});
            }
        })
        .catch(function (err) {
            console.error(err);
            res.send({message: "Error getting data from yelp"});
        });
});

app.listen(port, function () {
    console.log("Listening at port ", port);
});