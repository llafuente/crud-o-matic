const util = require('util');
const winston = require('winston');
const path = require('path');

const ReadableConsole = winston.transports.ReadableConsole = function(options) {
  //
  // Name this logger
  //
  this.name = options.name || 'ReadableConsole';

  //
  // Set the level from your options
  //
  this.level = options.level || 'info';
  this.trace = options.trace || false;
  this.basePath = options.basePath || path.join(__dirname, '..');
  this.std = options.std || process.stdout;
  this.styles = options.styles || {
    error: [41, 49],
    warn: [43, 49],
    info: [42, 49],
    verbose: null,
    debug: null,
    silly: null,
    db: [45, 49],
    request: [46, 49]
  };

  //
  // Configure your storage backing as you see fit
  //
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(ReadableConsole, winston.Transport);

ReadableConsole.prototype.log = function(level, msg, meta, callback) {
  //
  // Store this message and metadata, maybe use some custom logic
  // then callback indicating success.
  //

  let text;

  if (this.styles[level]) {
    level = '\u001b[' + this.styles[level][0] + 'm' + level + '\u001b[' + this.styles[level][1] + 'm';
  }


  if (meta instanceof Error) {
    msg = meta;
    meta = null;
  }

  const depth = ['silly', 'db'].indexOf(level) !== -1 ? null : 4;

  if (msg instanceof Error) {
    text = util.inspect(msg, {depth: depth, colors: true});
    text += '\n' + msg.stack.split('\n').slice(0, 5).join('\n');
  } else if (typeof msg === 'string') {
    text = msg;
  } else {
    text = util.inspect(msg, {depth: depth, colors: true});
  }
  const output = [];

  if (this.trace) {
    const stack = new Error().stack.split('\n').slice(8, 9).join('\n').trim();
    let file = stack.substring(stack.indexOf('(') + 1, stack.indexOf(')'));
    if (file.indexOf(this.basePath) == 0) {
      file = file.substring(this.basePath.length);
    }

    output.push(file);
    //output.push(stack);
  }

  output.push(level);
  output.push(text);
  output.push(util.inspect(meta, {depth: depth, colors: true}));
  output.push('\n');

  this.std.write(output.join(' '));

  callback(null, true);
};
