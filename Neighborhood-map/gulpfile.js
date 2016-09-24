var gulp = require("gulp");
var inline = require("gulp-inline-source");
var htmlMini = require("gulp-htmlmin");
var del = require("del");
var deleteEmpty = require("delete-empty");
var jsMini = require("gulp-uglify");
var cssMini = require("gulp-clean-css");

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


//build for public directory
gulp.task("build", ["build:js", "build:css", "build:index"]);