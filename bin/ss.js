#! /usr/bin/env node

var serverCommands = require('./server');
var buildApp = require('./buildApp');
var spawn = require('child_process').spawn;
var userArgs = process.argv.slice(2);
var command = userArgs[0];

switch (command) {
  case 'server':
    serverCommands.watch();
    serverCommands.devServer();
    serverCommands.server();
    break;
  case 'build':
    serverCommands.build();
    break;
  case 'new':
    buildApp.build(userArgs[1]);
    break;
}
