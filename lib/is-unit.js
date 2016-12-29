'use strict';

function isUnit(value) {
  return /^(0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|rem|vmin|vmax|vw|vh|ex|%|in|cm|mm|pt|pc)$/.test(value);
}

module.exports = isUnit;
