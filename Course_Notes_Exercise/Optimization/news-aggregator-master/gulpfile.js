var gulp = require('gulp'),
    autoPrefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    inline = require('gulp-inline-source'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    del = require('del');

function errorlog(err){
    console.error(err.message);
    this.emit('end');
}

gulp.task('test:serve', function(){
    browserSync.init({
        server: {
            baseDir: './app',
        }
    });
    gulp.watch("./app/*.html").on('change', browserSync.reload);
    gulp.watch("./app/scripts/*.js").on('change', browserSync.reload);
    gulp.watch("./app/styles/*.css").on('change', browserSync.reload);
});

gulp.task('build:empty', function(){
    del([
        './public/**',
    ]);
});

gulp.task('build:copy', ['build:empty'], function(){
    return gulp.src(['./app/**/*'])
                .pipe(gulp.dest('./public'));
});

gulp.task('build:clean', ['build:copy'], function(){
    del([
        './public/scripts/!(*.min.js)',
        './public/styles/!(*.min.css)',
        './public/index.html',
    ]);
});

gulp.task('build:HTML', ['build:clean'], function(){
    return gulp.src('./app/index.html')
                .pipe(plumber())
                .pipe(inline())
                .pipe(gulp.dest('./public/'));
});

gulp.task('build:serve', ['build:HTML'], function(){
    browserSync.init({
        server: {
            baseDir: './public',
        }
    });
    gulp.watch("./public/*.html").on('change', browserSync.reload);
    gulp.watch("./public/scripts/*.js").on('change', browserSync.reload);
    gulp.watch("./public/styles/*.css").on('change', browserSync.reload);
});

gulp.task('build', ['build:empty', 'build:copy', 'build:clean', 'build:HTML','build:serve']);

gulp.task('default', ['test:serve']);