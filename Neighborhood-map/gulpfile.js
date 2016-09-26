var gulp = require("gulp");
var inline = require("gulp-inline-source");
var htmlMini = require("gulp-htmlmin");
var del = require("del");
var deleteEmpty = require("delete-empty");
var jsMini = require("gulp-uglify");
var cssMini = require("gulp-clean-css");

//////////////////////////////////////////////////////////
//Dist Build
//////////////////////////////////////////////////////////

//empty dist folder
gulp.task("delete", function() {
    del.sync([
        "./dist/**",
    ]);
});

//copy everything to the dist folder
gulp.task("copy", ["delete"], function() {
    return gulp.src(["./src/**/*"])
        .pipe(gulp.dest("./dist"));
});

//delete files that will be optimized separately and delete empty folders
gulp.task("clean", ["copy"], function() {
    del.sync([
        "./dist/**/*.js",
        "./dist/**/*.css",
        "./dist/**/*.html",
    ]);
    deleteEmpty.sync("./dist/");
});

//inline resources for index.html, and minify html
gulp.task("build:index", ["clean"], function() {
    return gulp.src(["./src/index.html"])
        .pipe(inline())
        .pipe(htmlMini({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./dist/"));
});

//minify js files that are not inline
gulp.task("build:js", ["clean"], function() {
    return gulp.src(["./src/js/!(*.inline.js)"])
        .pipe(jsMini())
        .pipe(gulp.dest("./dist/js"));
});

//minify css files that are not inline
gulp.task("build:css", ["clean"], function() {
    return gulp.src("./src/css/!(*.inline.css)")
        .pipe(cssMini({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("./dist/css"));
});


//build for dist directory
gulp.task("build", ["build:js", "build:css", "build:index"]);