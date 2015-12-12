var spawn = require('child_process').spawn;
var exec = require('child_process').execSync;
var fs = require('fs');
var ncp = require('ncp');
var dot = require('dot');

exports.build = function(appName) {
  fs.mkdirSync('./' + appName);
  ncp(__dirname + '/../src', './' + appName, function(err) {
    if (err) {
      console.log(err);
      process.exit(0);
      return;
    }

    dot.templateSettings.strip = false;
    dot.templateSettings.varname = 'data';

    console.log('Copying Supersonic directory structure and files...');
    console.log('');

    fs.writeFileSync('./' + appName + '/package.json', dot.template(
      fs.readFileSync(__dirname + '/package.json.jst').toString()
    )({ name: appName }));

    var child = spawn('npm', ['cache', 'clean'], {cwd: process.cwd() + '/' + appName, stdio: [process.stdin, process.stdout, process.stderr]});

    child.on('exit', function() {
      var child = spawn('npm',  ['install'], {cwd: process.cwd() + '/' + appName, stdio: [process.stdin, process.stdout, process.stderr]});
      console.log('Installing packages in this directory...');
      console.log('');

      child.on('exit', function() {
        console.log('All done!');
        console.log('');
        console.log('Supersonic is now installed and you are ready to go!');
        console.log('');
        console.log('cd ' + appName + ' and type ss server to get started!');
      });
    });
  });
}
