var express = require("express");
var app = express();
var port = 8888;

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
}).listen(port, function(){
    console.log("listening on *:" + port);
});
