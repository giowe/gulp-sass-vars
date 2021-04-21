"use strict"

const Stream = require("readable-stream")
const StreamQueue = require("streamqueue")
const parse = require("parse-sass-value")
const pkg = require("./package.json")
const log = require("fancy-log")
const ansiGreen = require("ansi-colors").green
const supportsColor = require("color-support")

const colorDetectionOptions = {
  // If on Windows, ignore the isTTY check
  // This is due to AppVeyor (and thus probably common Windows platforms?) failing the check
  ignoreTTY: (process.platform === "win32"),
}

const defaultOptions = {
  verbose: true,
  quotes: "single",
  separator: "comma"
}

function green(msg) {
  if (supportsColor(colorDetectionOptions)) {
    return ansiGreen(msg)
  }

  return msg
}

function getStreamFromBuffer(string) {
  const stream = new Stream.Readable()
  stream._read = function() {
    stream.push(Buffer.from(string))
    stream._read = stream.push.bind(stream, null)
  }
  return stream
}

module.exports = (variables, options) => {
  options = Object.assign({}, defaultOptions, options)

  const statements = Object
    .keys(variables)
    .map(name => {
      let value = "null"

      try {
        value = parse(variables[name])
      } catch (error) {
        if (options.verbose)
          log(`${pkg.name}: skipping var ${green(name)}.\n`
            + `${pkg.name}: ${error.message}`)
      }

      return `$${name}: ${value}`
    })

  if (options.verbose) {
    log(`${pkg.name}: Injected ${green(statements.length)} variables to sass:\n`
      + `\t${statements.join("\n\t")}`)
  }

  const stream = new Stream.Transform({objectMode: true})

  stream._transform = function(file, enc, cb) {
    if(file.isNull()) {
      return cb(null, file)
    }

    const prependedBuffer = Buffer.from(statements.join("\n"))
    if(file.isStream()) {
      file.contents = new StreamQueue( getStreamFromBuffer(prependedBuffer), file.contents)
      return cb(null, file)
    }

    file.contents = Buffer.concat([prependedBuffer, file.contents],
      prependedBuffer.length + file.contents.length)
    cb(null, file)
  }

  return stream
}
