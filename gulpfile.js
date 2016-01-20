var autoprefixer = require('autoprefixer');
var babelify = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpImageDataURI = require('gulp-image-data-uri');
var gulpRename = require('gulp-rename');
var gulpShell = require('gulp-shell');
var notifier = require('node-notifier');
var path = require('path');
var runSequence = require('run-sequence');
var vinylSourceStream  = require('vinyl-source-stream');


var ROOT = __dirname;
var SRC_ROOT = path.join(ROOT, 'src');
var DIST_ROOT = path.join(ROOT, 'dist');
var JS_INDEX_FILE_PATH = path.join(SRC_ROOT, 'index.js');


function onErrorToWarn(err) {
  console.error(err.stack || err.message);
  notifier.notify({
    message: err.message,
    title: 'Gulp Error'
  });
  this.emit('end');
}


//
// JavaScripts
//

function createBundler(options) {
  options = options || {};
  var transformer = options.transformer || null;

  var browserifyOptions = {
  };
  // Pass options to browserify by whitelist
  [
    'debug'
  ].forEach(function(key) {
    browserifyOptions[key] = options[key];
  });

  var bundler = browserify(JS_INDEX_FILE_PATH, browserifyOptions);
  //bundler.exclude('react');

  if (transformer) {
    bundler.transform(transformer);
  }

  return bundler;
}

function createTransformer() {
  return babelify.configure({
    // Configure babel options here
    // Ref) http://babeljs.io/docs/usage/options/
    presets: [
      'es2015',
      'react'
    ]
  });
}

function bundle(bundler, options) {
  options = options || {};
  var onError = options.onError || function onError(err) { throw err; };

  return bundler
    .bundle()
    .on('error', onError)
    .pipe(vinylSourceStream('index.js'))
    .pipe(gulp.dest(DIST_ROOT))
  ;
}

gulp.task('build:js', function() {
  var bundler = createBundler({
    transformer: createTransformer()
  });
  return bundle(bundler);
});


gulp.task('build', ['build:js']);
