'use strict';

function is(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

module.exports = is;
