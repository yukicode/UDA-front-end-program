var express = require("express");
var app = express();
var http = require('http').Server(app);
var port = 8888;

var jsdom = require("jsdom").jsdom;
var cloud = require("d3-cloud");
var document = jsdom();
fs = require("fs");

app.use(express.static(__dirname));

app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/test.html');
});

app.get('/canvas', function (req, res) {
    // CSP headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "X-Requested-With");
    // response
    res.send(/*data*/);
});

http.listen(port, function () {
    console.log("listening on *:" + port);
});