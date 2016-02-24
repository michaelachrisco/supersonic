"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function BaseModel(attributes) {
  var _this = this;

  _classCallCheck(this, BaseModel);

  attributes.each(function (key, value) {
    _this[key] = value;
  });
};

exports.default = BaseModel;