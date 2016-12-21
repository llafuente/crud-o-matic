const cleanBody = require('./clean-body.js');
const HttpError = require('./http-error.js');
let model;
//let schema;

module.exports = function(mongoose) {
  model = mongoose.models.<%= schema.getPlural(); %>;
  //schema = mongoose.modelSchemas.<%= schema.getPlural(); %>;
};

module.exports.create = create;
module.exports.middleware = createMiddleware;

function create(data, next) {
  cleanBody(data);
  delete data.__v;

  $log.info('create data', data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return model.create(data, function(err, savedRow) {
    if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!savedRow) {
      return next(new HttpError(500, 'database don\'t return data'));
    }

    return next(null, savedRow);
  });
}

function createMiddleware(storeAt) {
  return function(req, res, next) {
    $log.info('create body', req.body);

    if (Array.isArray(req.body)) {
      return next(new HttpError(422, 'body is an array'));
    }

    return create(req.body, function(err, savedRow) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      req[storeAt] = savedRow;
      return next();
    });
  };
}

