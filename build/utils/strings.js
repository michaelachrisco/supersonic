'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heredoc = heredoc;
function heredoc(pieces) {
  for (var _len = arguments.length, value = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    value[_key - 1] = arguments[_key];
  }

  var str = '';
  pieces.forEach(function (piece, index) {
    var val = value[index] || '';
    str = str + piece + val;
  });
  return str.replace(/^\s*/gm, '').replace(/\s*$/gm, '');
}