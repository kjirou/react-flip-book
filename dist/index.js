'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./lib/utils');

var _loop = function _loop(_key2) {
  if (_key2 === "default") return 'continue';
  Object.defineProperty(exports, _key2, {
    enumerable: true,
    get: function get() {
      return _utils[_key2];
    }
  });
};

for (var _key2 in _utils) {
  var _ret = _loop(_key2);

  if (_ret === 'continue') continue;
}

var _flipBook = require('./lib/flip-book');

var _flipBook2 = _interopRequireDefault(_flipBook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _flipBook2.default;