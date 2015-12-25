#! /usr/bin/env node

var serverCommands = require('./server');
var buildApp = require('./buildApp');
var spawn = require('child_process').spawn;
var userArgs = process.argv.slice(2);
var command = userArgs[0];

function runServer() {
  serverCommands.watch();
  serverCommands.devServer();
  serverCommands.server();
}

switch (command) {
  case 'server':
    runServer();
    break;
  case 'build':
    serverCommands.build();
    break;
  case 'new':
    buildApp.build(userArgs[1]);
    break;
  case 'schema:dump':
    dumpSchema();
    break;
  case 's':
    runServer();
    break;
  case 'n':
    buildApp.build(userArgs[1]);
    break;
  case 'b':
    serverCommands.build();
    break;
}
