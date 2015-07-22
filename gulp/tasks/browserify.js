'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var debowerify = require('debowerify');
var handleErrors = require('../util/handle-errors');
var config = require('../config');

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {

	var bundler = browserify({
		entries     : [config.sourceDir + 'js/' + file],
		debug       : !global.isProd,
		cache       : {},
		packageCache: {},
		fullPaths   : true
	});

	if (watch) {
		bundler = watchify(bundler);
		bundler.on('update', function () {
			rebundle();
		});
	}

	bundler.transform(babelify.configure({
		optional: ['runtime', 'es7.asyncFunctions', 'es7.classProperties', 'es7.objectRestSpread', 'es7.decorators']
	}));
	bundler.transform(debowerify);

	function rebundle() {
		var stream = bundler.bundle();

		gutil.log('Rebundle...');

		return stream.on('error', handleErrors)
			.pipe(source(file))
			.pipe(gulpif(global.isProd, streamify(uglify())))
			.pipe(streamify(rename({
				basename: 'main'
			})))
			.pipe(gulpif(!global.isProd, sourcemaps.write('./')))
			.pipe(gulp.dest(config.scripts.dest));
	}

	return rebundle();
}

gulp.task('browserify', function () {

	// Only run watchify if NOT production
	return buildScript('index.js', !global.isProd);

});
