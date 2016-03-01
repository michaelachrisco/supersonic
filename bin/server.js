var spawn = require('child_process').spawn;
var exec = require('child_process').execSync;
var fs = require('fs');

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

  watchApp.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  watchServer.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  watchServer.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  watchConfig.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  watchConfig.stderr.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.devServer = function() {
  var devServer = spawn('webpack-dev-server', ['--config', './server/webpack.config.dev', '--hot', '--progress', '--inline', '--port', '8080']);

  devServer.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  devServer.stderr.on('data', function(data) {
    console.log(data.toString());
  });
}

exports.server = function() {
  var server = spawn('nodemon', ['build/server/server']);

  server.stdout.on('data', function(data) {
    console.info(data.toString());
  });

  server.stderr.on('data', function(data) {
    console.info(data.toString());
  });
}

exports.build = function() {
  if (!fs.existsSync('./build')) fs.mkdirSync('./build');
  if (!fs.existsSync('./build/app')) fs.mkdirSync('./build/app');
  if (!fs.existsSync('./build/config')) fs.mkdirSync('./build/config');
  if (!fs.existsSync('./build/server')) fs.mkdirSync('./build/server');

  var buildApp = spawn('babel', ['./app', '--out-dir', './build/app']);
  var buildServer = spawn('babel', ['./server', '--out-dir','./build/server']);
  var buildConfig = spawn('babel', ['./config', '--out-dir', './build/config']);

  buildApp.stdout.on('data', function(data) {
    console.log(data.toString())
  })

  buildApp.stderr.on('data', function(data) {
    console.log(data.toString())
  })

  buildServer.stdout.on('data', function(data) {
    console.log(data.toString())
  })

  buildServer.stderr.on('data', function(data) {
    console.log(data.toString())
  })

  buildConfig.stdout.on('data', function(data) {
    console.log(data.toString())
  })

  buildConfig.stderr.on('data', function(data) {
    console.log(data.toString())
  })
}
