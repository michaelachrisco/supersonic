var spawn = require('child_process').spawn;
var exec = require('child_process').execSync;
var fs = require('fs');
var ncp = require('ncp');
var dot = require('dot');
var chalk = require('chalk');
var heredoc = require('../build/utils/strings').heredoc

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

    console.log(chalk.green('Copying Supersonic directory structure and files...'));
    console.log('');

    // Create the package.json file
    fs.writeFileSync('./' + appName + '/package.json', dot.template(
      fs.readFileSync(__dirname + '/templates/package.json.jst').toString()
    )({ name: appName }));

    // Create the db.json file
    fs.writeFileSync('./' + appName + '/config/db.json', dot.template(
      fs.readFileSync(__dirname + '/templates/db.json.jst').toString()
    )({ appName: appName }));

    var child = spawn('npm', ['cache', 'clean'], {cwd: process.cwd() + '/' + appName, stdio: [process.stdin, process.stdout, process.stderr]});

    child.on('exit', function() {
      var child = spawn('npm',  ['install'], {cwd: process.cwd() + '/' + appName, stdio: [process.stdin, process.stdout, process.stderr]});
      console.log(chalk.yellow('Installing packages in this directory...'));
      console.log('');

      child.on('exit', function() {
        console.log(chalk.yellow('Running initial build and generating Relay schema...'));

        if (!fs.existsSync('./build')) fs.mkdirSync('./build');
        if (!fs.existsSync('./build/app')) fs.mkdirSync('./build/app');
        if (!fs.existsSync('./build/config')) fs.mkdirSync('./build/config');
        if (!fs.existsSync('./build/server')) fs.mkdirSync('./build/server');

        var builder = spawn('./node_modules/gulp/bin/gulp.js',  ['build'], {cwd: process.cwd() + '/' + appName, stdio: [process.stdin, process.stdout, process.stderr]});

        builder.on('exit', function() {
          console.info(heredoc`
            ${chalk.green('All done!')}
            ${chalk.green('Supersonic is now installed and you are ready to go!')}
            ${chalk.green('cd ' + appName + ' and type ss server to get started!')}
          `)
        });
      });
    });
  });
}
