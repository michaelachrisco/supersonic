require('babel-polyfill');
require('legit-inflectors');

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  livereload = require('gulp-livereload'),
  babel = require('gulp-babel'),
  graphql = require('gulp-graphql'),
  webpack = require('webpack-stream');

gulp.task('app', function () {
  gulp.src(['app/**/*.js', 'app/**/*.jsx']).
    pipe(babel()).
    pipe(gulp.dest('build/app'))
});

gulp.task('config', function () {
  gulp.src('config/**/*.js').
    pipe(babel()).
    pipe(gulp.dest('build/config'))
});

gulp.task('server', function () {
  gulp.src('server/**/*.js').
    pipe(babel()).
    pipe(gulp.dest('build/server'))
});

gulp.task('schema', function () {
  console.log("Updating graphql schema...");

  return gulp.src("./build/config/schema.js").
    pipe(graphql({
      json: true,
      graphql: true
    })).
    on('error', console.log).
    pipe(gulp.dest('./config'))
});

gulp.task('webpack', function () {
  return gulp.src('client/entry.js')
    .pipe(webpack( require('./server/webpack.config.dev.js') ))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch([
    './build/**/*.js'
  ], function (event) {
    return gulp.src(event.path)
      .pipe(livereload());
  });

  gulp.watch('app/**/*', ['app']);
  gulp.watch('config/**/*', ['config']);
  gulp.watch('server/**/*', ['server']);
  gulp.watch(['build/config/schema.js', 'build/app/models/**'], ['schema']);
});

gulp.task('serve', ['app', 'config', 'server', 'watch', 'schema', 'webpack'], function () {
  nodemon({
    script: 'build/server/server.js',
    ext: 'js jsx',
    ignore: ['node_modules']
  });

  livereload.listen();
});

/**
 * General Build
 */
gulp.task('default', ['serve']);
