// Gulp automated task execution file

var gulp        = require('gulp');                    // gulp itself
var browserSync = require('browser-sync').create();   // sync changes to browser
var minifyCSS   = require('gulp-minify-css');         // minify CSS
var uglify      = require('gulp-uglify');             // minify JavaScript
var imageMin    = require('gulp-imagemin');           // render down image size
var sourceMaps  = require('gulp-sourcemaps');         // map for debugging
var handleBars  = require('gulp-compile-handlebars'); // HTML templating
var rename      = require('gulp-rename');             // renaming files

var menuContent = require('./menu.json');             // JSON content of menu

// minify the java scripts
gulp.task( 'scripts', function() {
    gulp.src(['src/scripts/**/*.js'])
      .pipe(sourceMaps.init())
      .pipe(uglify())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('dist/scripts'))
      .pipe(browserSync.stream());
});

// minify the CSS
gulp.task('styles', function() {
    gulp.src(['src/styles/**/*.css'])
      .pipe(sourceMaps.init())
      .pipe(minifyCSS())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('dist/styles'))
      .pipe(browserSync.stream());
});

// render down image size
gulp.task('images', function() {
    gulp.src(['src/img/**/*'])
      .pipe(imageMin())
      .pipe(gulp.dest('dist/img'))
      .pipe(browserSync.stream());
});

gulp.task('templates', function() {
    var data    = {
        year: new Date().getFullYear(),
        menuData: menuContent.menuItems
    };
                    // data for handleBars
    var options = {                          // options for handleBars
      batch: ['src/templates/partials']
    };

    return gulp.src(['src/templates/**/*.hbs', '!src/templates/partials/**/*.hbs'])
      .pipe(handleBars( data, options ))
      .pipe(rename(function(path) {
        path.extname = '.html';
      }))
      .pipe(gulp.dest('./'));
});

// start browser-sync
gulp.task('default', ['templates', 'styles', 'scripts', 'images'], function(){
    console.log('Start execution of default task');

    browserSync.init({
        server: './'
    });

    // detect all changes on sources and trigger browser reload
    gulp.watch( 'src/templates/**/*.hbs', ['templates'] );
    gulp.watch( 'src/styles/**/*.css', ['styles'] );
    gulp.watch( 'src/scripts/**/*.js', ['scripts'] );
    gulp.watch( 'src/img/**/*', ['images'] );
    gulp.watch( '*.html', browserSync.reload );
});
