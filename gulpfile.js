const gulp = require('gulp');

// define plug-ins
const flatten         = require('gulp-flatten');
const gulpFilter      = require('gulp-filter');
const gulpConcat      = require('gulp-concat');
const uglify          = require('gulp-uglify');
const minifycss       = require('gulp-minify-css');
const rename          = require('gulp-rename');
const mainBowerFiles  = require('main-bower-files');

// Define paths variables
const dest_path =  'public/src/';
// grab libraries files from bower_components, minify and push in /public
gulp.task('publish-components', function() {

        let jsFilter = gulpFilter('**/*.js', {restore: true});
        let cssFilter = gulpFilter('**/*.css', {restore: true});

        return gulp.src(mainBowerFiles().concat('**/*.js'))
        .pipe(jsFilter)
        .pipe(gulp.dest(dest_path + '/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(dest_path + '/js'))
        .pipe(jsFilter.restore)

        // grab vendor css files from bower_components, minify and push in /public
        .pipe(cssFilter)
        .pipe(gulp.dest(dest_path + '/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(dest_path + '/css'))
        .pipe(cssFilter.restore)
});
