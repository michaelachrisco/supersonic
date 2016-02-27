'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('legit-inflectors');

var _squel = require('squel');

var _squel2 = _interopRequireDefault(_squel);

var _relation = require('./relation');

var _relation2 = _interopRequireDefault(_relation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = function () {
  _createClass(BaseModel, null, [{
    key: 'create',
    value: function create(params) {
      var pg = _squel2.default.useFlavour('postgres');
      var tableName = this.name.underscore().pluralize;

      return pg.insert().into(tableName).setFields(params).returning('*').toParam();
    }
  }, {
    key: 'relation',
    value: function relation(name) {
      return new _relation2.default(eval(name));
    }
  }, {
    key: 'first',
    value: function first() {
      return BaseModel.relation(this.name).first();
    }
  }, {
    key: 'find',
    value: function find(id) {
      return BaseModel.relation(this.name).find(id);
    }
  }, {
    key: 'where',
    value: function where(params) {
      return BaseModel.relation(this.name).where(params);
    }
  }]);

  function BaseModel(attributes) {
    _classCallCheck(this, BaseModel);

    for (var key in attributes) {
      this[key] = attributes[key];
    }
  }

  return BaseModel;
}();

exports.default = BaseModel;