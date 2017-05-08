'use strict';

const { log, colors: { green }, PluginError } = require('gulp-util');
const header = require('gulp-header');
const parse = require('parse-sass-value');
const pkg = require('./package.json');

/**
 * @typedef Options
 * @type {Object}
 * @property {boolean} verbose
 * @property {('single'|'double')} quotes
 * @property {('comma'|'space')} separator
 */

/**
 * Default plugin options.
 * @type {Options}
 */
const defaultOptions = {
  verbose: true,
  quotes: 'single',
  separator: 'comma'
};

/**
 * Parse object properties as SASS variables and inject them on streams.
 * @param {Object} variables
 * @param {Options} options
 * @returns {Stream}
 */
module.exports = (variables, options) => {
  options = Object.assign({}, defaultOptions, options);

  const statements = Object
    .keys(variables)
    .map(name => {
      let value = 'null';

      try {
        value = parse(variables[name]);
      } catch (error) {
        if (options.verbose)
          log(`${pkg.name}: skipping var ${green(name)}.\n`
            + `${pkg.name}: ${error.message}`);
      }

      return `$${name}: ${value};`;
    });

  if (options.verbose) {
    log(`${pkg.name}: Injected ${green(statements.length)} variables to sass:\n`
      + `\t${statements.join('\n\t')}`);
  }

  return header(statements.join('\n'));
};
