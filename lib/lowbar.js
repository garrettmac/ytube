'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  * @method hostname
  * @param {string} uri - a url
  * @return {string} hostname
  *
  * Example:
  *   input => "https://runkit.com/vygaio/utils"
  *   output =>
*/

// const _ = require("lodash")
// const URL = require("url")

var hostname = function hostname() {
  var uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  try {
    return new _url2.default.parse(uri).hostname.split(".")[0];
  } catch (e) {
    return uri;
  }
};

/**
  * @method domain
  * @param {string} uri - a url
  * @return {string} domain
  *
  * Example:
  *   input => "https://runkit.com/vygaio/utils"
  *   output => "runkit.com"
*/

var domain = function domain() {
  var uri = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  try {
    return new _url2.default.parse(uri).hostname;
  } catch (e) {
    return "";
  }
};

/**
  * Capitalize Each Word in string
  * @method titleCase
  * @param {string}
  * @return {string}
  *
  * Example:
  *   input => "hello world"
  *   output => "Hello World"
*/
var titleCase = function titleCase() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return s.split(' ').map(function (w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
};

// titleCase(words)


/**
  * Capitalize Each Word in string
  * @method TitleCase
  * @param {string} s - input string
  * @param {string} f - search for substring
  * @param {string} r - replace substring
  * @return {string}
  *
*/

var replaceAll = function replaceAll() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  return s.replace(new RegExp(f.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), r);
};

// replaceAll(words,"o","@")//=>repaces all o's
// replaceAll(words,"o")//=>remove all o's


//OBJECTS

var removeFalsy = function removeFalsy(o) {
  return _lodash2.default.each(o, function (v, k) {
    if (!v) delete o[k];
  });
};

//ARRAYS


var toObject = function toObject(input) {
  var obj = {};
  Object.keys(input).map(function (o) {
    return obj[o] = input[o];
  });
  return obj;
};

var make = function make() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var val = args.shift();
  args.map(function (arg) {
    return val = arg(val);
  });
  return val;
};

// export {
_lodash2.default.mixin({
  //STR
  hostname: hostname,
  domain: domain,
  titleCase: titleCase,
  replaceAll: replaceAll,
  //OBJ
  removeFalsy: removeFalsy,
  //ARRAY
  toObject: toObject,
  make: make
});
// }


exports.default = _lodash2.default;

// let uri = "https://runkit.com/vygaio/utils"
// let words = "Lorem ipsum dolor sit amet, consectetur adipisicing elit"

// let r=_.make(uri, _.domain, _.titleCase)
// console.log(" r: ",r);