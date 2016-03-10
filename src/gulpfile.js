require('babel-polyfill');
require('legit-inflectors');

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  babel = require('gulp-babel'),
  graphql = require('gulp-graphql'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  gutil = require('gulp-util'),
  del = require('del'),
  runSequence = require('run-sequence')

var buildPath = 'build/';

function removeBuild() {
  return del(buildPath)
}

function buildApp(callback) {
  runSequence('clean', ['app', 'config', 'server'], 'schema', callback)
}

gulp.task('build', buildApp)
gulp.task('clean', removeBuild)

gulp.task('app', function () {
  gulp.src(['app/**/*.js', 'app/**/*.jsx', 'app/mutations/**/*.js']).
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
  var config = require('./server/webpack.config.dev.js')

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html")
  })
});

gulp.task('watch', function () {
  gulp.watch('app/**/*', ['app']);
  gulp.watch('config/**/*', ['config']);
  gulp.watch('server/**/*', ['server']);
  gulp.watch(['build/config/schema.js', 'build/app/models/**'], ['schema']);
});

gulp.task('serve', ['watch', 'webpack'], function () {
  nodemon({
    script: 'build/server/server.js',
    ext: 'js jsx',
    ignore: ['node_modules']
  });
});

/**
 * General Build
 */
gulp.task('default', ['serve']);
