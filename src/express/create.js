module.exports = create;
module.exports.middleware = createMiddleware;

const mongoose = require('mongoose');
const cleanBody = require('<%= generatorOptions.componentsPath %>/clean-body.js');
const HttpError = require('<%= generatorOptions.componentsPath %>/http-error.js');

function create(data, next) {
  cleanBody(data);
  delete data.__v;

  $log.info('create data', data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return mongoose.models.<%= schema.getName() %>.create(data, function(err, savedData) {
    if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!savedData) {
      return next(new HttpError(500, 'database don\'t return data'));
    }

    return next(null, savedData);
  });
}

function createMiddleware(storeAt) {
  return function(req, res, next) {
    $log.info('create body', req.body);

    if (Array.isArray(req.body)) {
      return next(new HttpError(422, 'body is an array'));
    }

    return create(req.body, function(err, savedData) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      req[storeAt] = savedData;
      return next();
    });
  };
}

