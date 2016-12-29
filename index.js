'use strict';

const Stream = require('readable-stream');
const StreamQueue = require('streamqueue');
const { log, colors, PluginError } = require('gulp-util');
const pkg = require('./package.json');
const parseVars = require('./parse');
const is = require('./lib/is');

function getStreamFromBuffer(string) {
  const stream = new Stream.Readable();
  stream._read = function() {
    stream.push(new Buffer(string));
    stream._read = stream.push.bind(stream, null);
  };
  return stream;
}

module.exports = function(vars, opt) {
  opt = opt || {};
  opt.verbose = is('Boolean', opt.verbose) ? opt.verbose : true;

  const sassVars = parseVars(vars, opt.verbose);
  const prepend = sassVars.join("\n");

  if (opt.verbose) {
    log(`${pkg.name}: Injected ${colors.green(sassVars.length)} variables to sass:`);
    sassVars.map(statement => log(statement));
  }

  const stream = new Stream.Transform({objectMode: true});

  stream._transform = function(file, enc, cb) {
    if(file.isNull()) {
      return cb(null, file);
    }

    const prependedBuffer = new Buffer(prepend);
    if(file.isStream()) {
      file.contents = new StreamQueue( getStreamFromBuffer(prependedBuffer), file.contents);
      return cb(null, file);
    }

    file.contents = Buffer.concat([prependedBuffer, file.contents],
      prependedBuffer.length + file.contents.length);
    cb(null, file);
  };

  return stream;
};
