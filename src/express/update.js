// NOTE update don't need mongoose instance

module.exports = update;
module.exports.middleware = middleware;

//const mongoose = require('mongoose');
const cleanBody = require('./clean-body.js');
const HttpError = require('./http-error.js');

function update(user, row, data, next) {
  cleanBody(data);

  // TODO
  //data = meta.$express.restricted_filter(log, user, 'update', data);

  // TODO review this!
  row.set(data);

  row.save(function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!savedRow) {
      return next(new HttpError(422, 'database don\'t return data'));
    }

    return next(null, savedRow);
  });
}

// storedAt -> read
// storeAt -> saved
function middleware(storedAt, storeAt) {
  return function(req, res, next) {
    $log.info('update body', req.body);

    if (Array.isArray(req.body)) {
      return next(new HttpError(422, 'body is an array'));
    }

    if (!req[storedAt]) {
     return next(new HttpError(422, 'Cannot fetch <%= schema.getName() %>'));
    }

    return update(req.user, req[storedAt], req.body, function(err, savedRow) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      req[storeAt] = savedRow;

      return next();
    });
  };
}
