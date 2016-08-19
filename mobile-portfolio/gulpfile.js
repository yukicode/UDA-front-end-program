var gulp = require("gulp");
var inline = require("gulp-inline-source");
var htmlMini = require("gulp-htmlmin");
var del = require("del");
var deleteEmpty = require("delete-empty");
var jsMini = require("gulp-uglify");
var cssMini = require("gulp-clean-css");

var ngrok = require("ngrok");
var psi = require("psi");
var sequence = require("run-sequence");
var site = "";
var browserSync = require("browser-sync");

//////////////////////////////////////////////////////////
//Public Build
//////////////////////////////////////////////////////////

//empty public folder
gulp.task("delete", function() {
    del.sync([
        "./public/**",
    ]);
});

//copy everything to the public folder
gulp.task("copy", ["delete"], function() {
    return gulp.src(["./app/**/*"])
        .pipe(gulp.dest("./public"));
});

//delete files that will be optimized separately and delete empty folders
gulp.task("clean", ["copy"], function() {
    del.sync([
        "./public/**/*.js",
        "./public/**/*.css",
        "./public/**/*.html",
    ]);
    deleteEmpty.sync("./public/");
});

//inline resources for index.html, and minify html
gulp.task("build:index", ["clean"], function() {
    return gulp.src(["./app/index.html"])
        .pipe(inline())
        .pipe(htmlMini({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./public/"));
});

//inline resources for pizza.html, and minify html
//can't be merged in build:index because of unresolved error
gulp.task("build:pizza", ["clean"], function() {
    return gulp.src(["./app/views/pizza.html"])
        .pipe(inline())
        .pipe(htmlMini({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./public/views/"));
});

//minify js files that are not inline
gulp.task("build:js", ["clean"], function() {
    return gulp.src(["./app/js/!(*.inline.js)"])
        .pipe(jsMini())
        .pipe(gulp.dest("./public/js"));
});

//minify css files that are not inline
gulp.task("build:css", ["clean"], function() {
    return gulp.src("./app/css/!(*.inline.css)")
        .pipe(cssMini({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("./public/css"));
});

//////////////////////////////////////////////////////////
//Page Speed Test
//////////////////////////////////////////////////////////
//resource: http://una.im/gulp-local-psi/

//Serve index.html with browserSync
gulp.task("test:server", function(cb) {
    browserSync({
        port: 8000,
        open: false,
        server: {
            baseDir: "./public",
        },
    }, cb);
});

//Forward site using ngrok for speed test
gulp.task("test:ngrok", function(cb) {
    return ngrok.connect(8000, function(err, url) {
        site = url;
        console.log("serving from " + site);
        cb();
    });
});

//Use page speed insight to test index.html for desktop
//result is output to the console
gulp.task("test:psi-desktop", function(cb) {
    console.log("Testing site: ", site);
    console.log("It will take about a minute");
    psi.output(site, {
            nokey: "true",
            strategy: "desktop",
        })
        .then(function() {
            cb();
        });
});

//Use page speed insight to test index.html for mobile
//result is output to the console
gulp.task("test:psi-mobile", function(cb) {
    console.log("Testing site: ", site);
    console.log("It will take about a minute");
    psi.output(site, {
            nokey: "true",
            strategy: "mobile",
        })
        .then(function() {
            cb();
        });
});

//sequencially run tasks
gulp.task("test:psi-seq", function(cb) {
    console.log("Start server and page speed test");
    return sequence(
        "test:server",
        "test:ngrok",
        "test:psi-desktop",
        "test:psi-mobile",
        cb
    );
});

//////////////////////////////////////////////////////////
//Serve index.html locally
//////////////////////////////////////////////////////////
gulp.task("serve", function(cb) {
    browserSync({
        port: 8080,
        server: {
            baseDir: "./public",
        },
    }, cb);
});

//////////////////////////////////////////////////////////
//Tasks
//////////////////////////////////////////////////////////

//build for public directory
gulp.task("build", ["build:js", "build:css", "build:index", "build:pizza"]);

//page speed test of index.html
gulp.task("pageSpeedTest", ["test:psi-seq"], function() {
    console.log("End of page speed test");
    process.exit();
});

//serve index.html
gulp.task("default", ["serve"]);