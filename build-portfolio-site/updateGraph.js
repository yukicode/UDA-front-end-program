// Generates a word-cloud with skills from bio.skills
// export to a svg file
var jsdom = require("jsdom").jsdom;
var document = jsdom();
var cloud = require("d3-cloud");
var fs = require("fs");
var decorationArray;
var index = 0;
var colors = ["#1199c3","#2d3c49"];
//TODO: load skills from the bio object
//module.export works only when bio is in a separated file
var skills = [
    "C#",
    "JavaScript",
    ".net",
    "HTML",
    "CSS",
    "NodeJS",
    "C++",
    "Git",
];

fs.readFile("file.txt", "utf8", function(err, data){
    decorationArray = data.toString().split(">\r\n<");
});

jsdom.env(
    "<html><body></body></html>",
    [ "http://d3js.org/d3.v3.min.js",],
    function (err, window) {
        var words = skills.map(function(d) {
            return {text: d, size: 60 + Math.random() * 60};
        });
        var decorations = decorationArray.map(function(d){
            return {text: d, size: 10 + Math.random() * 18};
        })
        words = words.concat(decorations);
        var worldCloud = cloud()
            .size([1170, 350])
            .canvas(function() { return window.document.createElement("canvas"); })
            .words(words)
            .padding(5)
            .spiral("rectangular")
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
            .style("fill", function(d){
                return d.color = colors[index++%2];
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });

        fs.writeFileSync('./images/graph.svg', window.document.body.children[1].outerHTML);
    }
);
