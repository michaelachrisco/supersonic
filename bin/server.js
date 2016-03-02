var spawn = require('child_process').spawn;
var exec = require('child_process').execSync;
var fs = require('fs');

exports.clean = function() {
  exec('rm -rf build');
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
