module.exports = errorHandler;

const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const CastError = mongoose.Error.CastError;
const _ = require('lodash');
const forEach = _.forEach;
const clone = _.clone;
const HttpError = require('./http-error.js');

function mongooseToReadable(schema, error, path) {
  const err = clone(error);

  if (err.name === 'CastError') {
    err.type = 'invalid-type';
    err.message = 'cast-failed';
    err.value_constraint = 'cast';
    delete err.reason;
    delete err.stringValue;
  } else if (err.name === 'ValidatorError') {
    err.type = 'invalid-value';
    err.value_type = null; // ??
    err.value_constraint = err.properties.kind || err.properties.type;
    delete err.properties;
  }
  const options = schema.path(path);
  if (options && options.options) {
    // remove empty labels
    if (options.options.label) {
      err.label = options.options.label;
    }

    if (typeof options.options.type === 'function') {
      err.value_type = options.options.type.name.toLowerCase();
    } else {
      err.value_type = options.options.type;
    }
  } else {
    err.value_type = err.value_type === undefined ? null : err.value_type;
  }

  delete err.name;
  delete err.kind;
  //not necessary, redundant
  delete err.properties;

  return err;
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  $log.error(err);

  if (Array.isArray(err)) {
    return res.status(500).json({
      error: err.map(function(e) {
        return e.message;
      })
    });
  }

  if (err instanceof CastError) {
    $log.silly('CastError');
    return res.status(400).json({
      error: mongooseToReadable(req.schema, err, err.path)
    });
  } else if (err instanceof ValidationError) {
    $log.silly('ValidationError');
    // cleanup error
    const errors = [];
    forEach(err.errors, function(err2, path) {
      errors.push(mongooseToReadable(req.schema, err2, path));
    });

    return res.status(400).json({error: errors});
  } else if (err instanceof HttpError) {
    return res.status(err.status).json({error: err.message});
  }

  if (err.status) {
    $log.silly('StatusedError: ' + err.message);
    return res.status(err.status).json({
      error: err.message,
      trace: err.stack
    });
  }

  $log.silly('Exception');
  return res.status(500).json({error: err.message});
}
