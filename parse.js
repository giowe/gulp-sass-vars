'use strict';

const is = require("./lib/is");
const isColor = require('is-color');
const isLength = require('is-css-length');
const { log, colors, PluginError } = require('gulp-util');
const pkg = require('./package.json');

function parseList(values, verbose) {
  let list = values.map(value => parseValue(value, verbose));
  return `(${list.join(', ')})`;
}

function parseMap(object, verbose) {
  let pairs = [];
  for (let key in object) {
    if (!object.hasOwnProperty(key)) // prototype property
      continue;
    pairs.push(`'${key}': ${parseValue(object[key], verbose)}`);
  }
  return `(${pairs.join(', ')})`;
}

function parseValue(value, verbose) {
  if (is('String', value)) { // parses string, length and colors
    if (isColor(value) || isLength(value))
      return value;
    return `'${value.replace(/\'/g, '\\\'')}'`;
  }

  if (is('Number', value) || is('Boolean', value))
    return value.toString();

  if (is('Null', value))
    return 'null';

  if (is('Array', value))
    return parseList(value, verbose);

  if (is('Object', value) || value instanceof Object && !is('Function', value)) // to parse instances too
    return parseMap(value, verbose);

  if (is('Undefined', value))
    throw new PluginError(pkg.name, 'Can\'t parse undefined values. No SASS equivalent');

  if (is('Function', value))
    throw new PluginError(pkg.name, 'Can\'t parse function expressions. No SASS equivalent');
}

function parseVars(variables, verbose) {
  var vars = [];
  for (let variable in variables) {
    if (!variables.hasOwnProperty(variable))
      continue;
    let value = variables[variable];
    try {
      vars.push(`$${variable}: ${parseValue(value)};`);
    } catch(err) {
      if (verbose) { // Just warning errors and skipping them
        log(`${pkg.name}: skipping var ${colors.green(variable)}.`);
        log(`${pkg.name}: ${err.message}`);
      }
      continue;
    }
  }
  return vars;
}

module.exports = parseVars;
