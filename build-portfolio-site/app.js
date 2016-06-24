var express = require("express");
var app = express();
var port = 8888;
var jsdom = require("jsdom").jsdom;
var document = jsdom();
var cloud = require("d3-cloud");
var fs = require("fs");
var skills = require("./js/asset.js").skills();

jsdom.env(
    "<html><body></body></html>",
    [ "http://d3js.org/d3.v3.min.js",],
    function (err, window) {
        var words = skills.map(function(d) {
                return {text: d, size: 50 + Math.random() * 70};
            });
        fs.readFile("/file.txt", "utf8", function(err, data){console.log(data);});

        var worldCloud = cloud()
            .size([1170, 350])
            .canvas(function() { return window.document.createElement("canvas"); })
            .words(words)
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .start();
        var svg = window.d3.select("body")
            .append("svg")
            .attr("width", 1170)
            .attr("height", 350)
            .attr("xmlns","http://www.w3.org/2000/svg")
            .attr("xmlns:xlink","http://www.w3.org/1999/xlink");

        svg.append("g")
            .attr("transform", "translate(" + 1170 / 2 + "," + 350 / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", "#1199c3")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });

        fs.writeFileSync('./images/graph.svg', window.document.body.children[1].outerHTML);
    }
);

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
}).listen(port, function(){
    console.log("listening on *:" + port);
});