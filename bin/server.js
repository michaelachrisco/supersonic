var spawn = require('child_process').spawn;
var exec = require('child_process').execSync;

exports.clean = function() {
  exec('rm -rf build');
}

exports.watch = function() {
  var watchApp = spawn('babel', ['app', '-d', 'build/app', '-w']);
  var watchServer = spawn('babel', ['server', '-d', 'build/server', '-w']);
  var watchConfig = spawn('babel', ['config', '-d', 'build/config', '-w']);

  watchApp.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  watchServer.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  watchConfig.stdout.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.devServer = function() {
  var devServer = spawn('webpack-dev-server', ['--config', './server/webpack.config.dev', '--hot', '--progress', '--inline', '--port', '8080']);

  devServer.stdout.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.server = function() {
  var server = spawn('nodemon', ['build/server/server']);

  server.stdout.on('data', function(data) {
    console.info(data.toString());
  });
}

exports.build = function() {
  exec('babel app server config -d build/app build/server build/config');
}
