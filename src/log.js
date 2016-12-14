require('./winston.readableconsole.js');

const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [new (winston.transports.ReadableConsole)({
    level: 'silly',
    trace: false
  })]
});
logger.setLevels({
  error: 0,
  warn: 1,
  info: 2,
  request: 2,
  verbose: 3,
  db: 3,
  debug: 4,
  silly: 5,
  all: 6, // max verbosity
});

global.$log = logger;
