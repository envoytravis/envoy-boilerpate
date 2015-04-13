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
    del = require('del');


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

    return gulp.src(buildDir + '/styles/**/*.css')
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

// should modify webpack and use loader to minify
gulp.task('scripts:build', function () {

    return gulp.src(buildDir + '/scripts/**/*.js')
        .pipe(gulp.dest(buildDir + '/scripts'));
});

////////////////////////////////
// Handle HTML
gulp.task('html', function() {
    gulp.src(['app/**/*.html', '!app/partials/**/*.html'])
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
// Lint HTML (aria, standards)
gulp.task('html:lint', function () {

    var arialinter = require('gulp-arialinter'),
        w3cjs = require('gulp-w3cjs');

    return gulp.src(buildDir + '/**/*.html')
        .pipe(arialinter({
            level: 'AA'
        }))
        .pipe(w3cjs({
            
        }));
});


//////////////////////
// Optimize & Pipe Images
gulp.task('images', function () {

    var imgDir = buildDir + '/images';

    return gulp.src('app/images/**/*')
        // .pipe(newer(imgDst))
        // .pipe(imageOptimization({
        //     optimizationLevel: 5,
        //     progressive: true,
        //     interlaced: false
        // }))
        .pipe(gulp.dest(imgDir));
});


/////////////////////
// Pipe Fonts
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest(buildDir + '/fonts'));
});


////////////////////////////////
// Include .htaccess, favicons, etc. in build folder
gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
        .pipe(gulp.dest(buildDir));
});


////////////////////////////////
// Start local server
gulp.task('serve', ['styles', 'scripts'], function () {
    browserSync({
        server: './dist',
        port: 8000,
        open: false
    });
});


////////////////////////////////
// Clean build folder
gulp.task('clean', function () {
    del(buildDir);
});


////////////////////////////////
// Watch Files
gulp.task('watch', ['serve'], function () {
    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.{js,jsx}', ['scripts-complete']);
});


gulp.task('default', ['watch']);
gulp.task('build', ['html', 'styles:build', 'scripts', 'images', 'fonts', 'extras']);