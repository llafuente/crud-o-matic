module.exports = create;
module.exports.middleware = createMiddleware;

const mongoose = require('mongoose');
var cleanBody = require('<%= generatorOptions.componentsPath %>/clean-body.js');
var httpError = require('<%= generatorOptions.componentsPath %>/http-error.js');

function create(data, next) {
  cleanBody(data);
  delete data.__v;

  $log.info('create data', data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return mongoose.models.<%= schema.getName() %>.create(data, function(err, saved_data) {
    if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!saved_data) {
      return next(new httpError(500, 'database don\'t return data'));
    }

    next(null, saved_data);
  });
}

function createMiddleware(store_at) {
  return function(req, res, next) {
    $log.info('create body', req.body);

    if (Array.isArray(req.body)) {
      return next(new httpError(422, 'body is an array'));
    }

    return create(req.body, function(err, saved_data) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      req[store_at] = saved_data;
      next();
    });
  };
}

