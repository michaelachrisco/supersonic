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

  var builder = spawn('./node_modules/gulp/bin/gulp.js',  ['build'], {cwd: process.cwd() + '/', stdio: [process.stdin, process.stdout, process.stderr]});
}
