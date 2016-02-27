"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _pathIsAbsolute = require("path-is-absolute");

var _pathIsAbsolute2 = _interopRequireDefault(_pathIsAbsolute);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _module3 = require("module");

var _module4 = _interopRequireDefault(_module3);

var _util = require("util");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _repl = require("repl");

var _repl2 = _interopRequireDefault(_repl);

var _babelCore = require("babel-core");

var babel = _interopRequireWildcard(_babelCore);

var _vm = require("vm");

var _vm2 = _interopRequireDefault(_vm);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

//require("babel-polyfill");

var _babelRegister = require("babel-register");

var _babelRegister2 = _interopRequireDefault(_babelRegister);

var program = new _commander2["default"].Command("babel-node");

program.option("-e, --eval [script]", "Evaluate script");
program.option("-p, --print [code]", "Evaluate script and print result");
program.option("-o, --only [globs]", "");
program.option("-i, --ignore [globs]", "");
program.option("-x, --extensions [extensions]", "List of extensions to hook into [.es6,.js,.es,.jsx]");
program.option("-w, --plugins [string]", "", _babelCore.util.list);
program.option("-b, --presets [string]", "", _babelCore.util.list);

var pkg = require("../../package.json");
program.version(pkg.version);
program.usage("[options] [ -e script | script.js ] [arguments]");
program.parse(process.argv);

//

_babelRegister2["default"]({
  extensions: program.extensions,
  ignore: program.ignore,
  only: program.only,
  plugins: program.plugins,
  presets: program.presets
});

//

var replPlugin = function replPlugin() {
  return {
    visitor: {
      ModuleDeclaration: function ModuleDeclaration(path) {
        throw path.buildCodeFrameError("Modules aren't supported in the REPL");
      },

      VariableDeclaration: function VariableDeclaration(path) {
        if (path.node.kind !== "var") {
          throw path.buildCodeFrameError("Only `var` variables are supported in the REPL");
        }
      }
    }
  };
};

var _eval = function _eval(code, filename) {
  code = code.trim();
  if (!code) return undefined;

  code = babel.transform(code, {
    filename: filename,
    presets: program.presets,
    plugins: (program.plugins || []).concat([replPlugin])
  }).code;

  return _vm2["default"].runInThisContext(code, {
    filename: filename
  });
};


function replEval(code, context, filename, callback) {
  var err = undefined;
  var result = undefined;

  try {
    if (code[0] === "(" && code[code.length - 1] === ")") {
      code = code.slice(1, -1); // remove "(" and ")"
    }

    result = _eval(code, filename);
  } catch (e) {
    err = e;
  }

  callback(err, result);
}

exports.start = function() {
  return _repl2["default"].start({
    prompt: "babel> ",
    input: process.stdin,
    output: process.stdout,
    eval: replEval,
    useGlobal: true
  });
}
