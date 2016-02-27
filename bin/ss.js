#! /usr/bin/env babel-node

require('legit-inflectors');
require('legit-rubyfill');

var serverCommands = require('./server');
var buildApp = require('./buildApp');
var db = require('./db');
var generate = require('./generate');
var console = require('./console');
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
  case 'console':
    console.run()
    break;
  case 'generate':
    generate.call(userArgs);
    break;
  case 'db:migrate':
    db.migrate()
    break;
  case 'db:setup':
    db.setup()
    break;
  case 'db:reset':
    db.reset()
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
  case 'g':
    generate.call(userArgs);
    break;
  case 'c':
    console.run()
    break;
}
