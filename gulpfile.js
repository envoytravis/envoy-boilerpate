////////////////////////////////
// Load Modules
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    webpack = require('gulp-webpack'),
    swig = require('gulp-swig'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    path = require('path');


////////////////////////////////
// Config
var buildDir = 'dist',
    paths = {
        pages: './pages/',
        partials: './partials/',
        assets: './assets/',
        sass: './scss/'
    };


////////////////////////////////
// Handle Styles
gulp.task('styles', function () {

    var autoprefixer = require('autoprefixer-core')({
        browsers: ['last 2 versions', 'ie >= 9']
    });

    return gulp.src('app/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            includePaths: ['./node_modules/', 'app/bower_components/']
        }))
        .pipe(postcss([
            autoprefixer.postcss
        ]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildDir + '/styles'))
        .pipe(reload({stream:true}));
});

gulp.task('styles:build', ['styles'], function () {

    var csso = require('gulp-csso');

    return gulp.src('.tmp/styles/*.css')
        .pipe(csso(true))
        .pipe(gulp.dest(buildDir + '/styles'));
});


////////////////////////////////
// Handle Scripts
gulp.task('scripts', function () {

    var webpackConfig = require('./webpack.config.js');

    return gulp.src('app/scripts/**/*.{js,jsx}')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(buildDir + '/scripts'));
});

gulp.task('scripts-complete', ['scripts'], reload);


////////////////////////////////
// Handle HTML
gulp.task('html', function() {
    gulp.src([
        path.join('app/**/*.html')
    ])
    .pipe(swig({
        setup: function (swig) {
            swig.setDefaults({
            cache: false,
                loader: swig.loaders.fs(__dirname + '/app/partials/')
            });
        }
    }))
    .pipe(gulp.dest(buildDir))
    .pipe(reload({stream:true}));
});


////////////////////////////////
// Serve
gulp.task('serve', ['styles', 'scripts'], function () {
    browserSync({
        server: './dist',
        port: 8000,
        open: false
    });
});


////////////////////////////////
// Watch Files
gulp.task('watch', ['serve'], function () {
    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.{js,jsx}', ['scripts-complete']);
});


gulp.task('default', ['watch']);