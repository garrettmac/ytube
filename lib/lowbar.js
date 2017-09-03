// const _ = require("lodash")
// const URL = require("url")

import URL from 'url';
import _ from 'lodash';

/**
  * @method hostname
  * @param {string} uri - a url
  * @return {string} hostname
  *
  * Example:
  *   input => "https://runkit.com/vygaio/utils"
  *   output =>
*/

const hostname = (uri = "") => {
  try {
    return new URL.parse(uri).hostname.split(".")[0];
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

const domain = (uri = "") => {
  try {
    return new URL.parse(uri).hostname;
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
const titleCase = (s = "") => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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

const replaceAll = (s = "", f = "", r = "") => s.replace(new RegExp(f.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), r);

// replaceAll(words,"o","@")//=>repaces all o's
// replaceAll(words,"o")//=>remove all o's


//OBJECTS

const removeFalsy = o => _.each(o, (v, k) => {
  if (!v) delete o[k];
});

//ARRAYS


const toObject = input => {
  let obj = {};
  Object.keys(input).map(o => obj[o] = input[o]);
  return obj;
};

const make = (...args) => {
  let val = args.shift();
  args.map(arg => val = arg(val));
  return val;
};

// export {
_.mixin({
  //STR
  hostname,
  domain,
  titleCase,
  replaceAll,
  //OBJ
  removeFalsy,
  //ARRAY
  toObject,
  make
});
// }


export default _;

// let uri = "https://runkit.com/vygaio/utils"
// let words = "Lorem ipsum dolor sit amet, consectetur adipisicing elit"

// let r=_.make(uri, _.domain, _.titleCase)
// console.log(" r: ",r);