module.exports = function(grunt) {

  // from: https://lincolnloop.com/blog/untangle-your-javascript-browserify/
  var browserify = require('gulp-browserify');
  var gulp = require('gulp');
  var rename = require('gulp-rename');

  var production = false;

  gulp.task('browserify', function() {
    var production = gutil.env.type === 'production';

    gulp.src(['javascripts/index.js'], {
      read: false
    })

    // Browserify, and add source maps if this isn't a production build
    .pipe(browserify({
      debug: !production,
      transform: ['reactify'],
      extensions: ['.jsx']
    }))

    .on('prebundle', function(bundler) {
      // Make React available externally for dev tools
      bundler.require('react');
    })

    // Rename the destination file
    .pipe(rename('bundle.js'))

    // Output to the build directory
    .pipe(gulp.dest('build/'));
  });

}
