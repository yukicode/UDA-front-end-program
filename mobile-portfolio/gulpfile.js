var gulp = require("gulp");
var inline = require("gulp-inline-source");
var htmlMini = require("gulp-htmlmin");
var del = require("del");
var deleteEmpty = require("delete-empty");
var jsMini= require("gulp-uglify");
var cssMini = require("gulp-clean-css");

//inline resources for index.html, and minify html
gulp.task("build:index", ["clean"], function(){
    return gulp.src(["./app/index.html"])
            .pipe(inline())
            .pipe(htmlMini({collapseWhitespace: true}))
            .pipe(gulp.dest("./public/"));
});

//inline resources for pizza.html, and minify html
//can't be merged in build:index because of unknown error
gulp.task("build:pizza",["clean"],function(){
    return gulp.src(["./app/views/pizza.html"])
            .pipe(inline())
            .pipe(htmlMini({collapseWhitespace: true}))
            .pipe(gulp.dest("./public/views/"));
});

//minify js files that are not inline
gulp.task("build:js", ["clean"] , function(){
    return gulp.src(["./app/js/!(*.inline.js)"])
            .pipe(jsMini())
            .pipe(gulp.dest("./public/js"));
});

//minify css files that are not inline
gulp.task("build:css", ["clean"], function(){
    return gulp.src("./app/css/!(*.inline.css)")
            .pipe(cssMini({compatibility: 'ie8'}))
            .pipe(gulp.dest("./public/css"));
});

//empty public folder
gulp.task("delete", function(){
    del.sync([
        "./public/**",
    ]);
});

//copy everything to the public folder
gulp.task("copy", ["delete"], function(){
    return gulp.src(['./app/**/*'])
                .pipe(gulp.dest('./public'));
});

//delete unnecessary files and empty folders
gulp.task("clean", ["copy"], function(){
    del.sync([
        './public/**/*.js',
        './public/**/*.css',
        './public/**/*.html',
    ]);
    deleteEmpty.sync("./public/");
});

gulp.task("build", ["build:js", "build:css", "build:index", "build:pizza"]);