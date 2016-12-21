const HttpError = require('./http-error.js');
let model;
//let schema;

module.exports = function(mongoose) {
  model = mongoose.models.<%= schema.getPlural(); %>;
  //schema = mongoose.modelSchemas.<%= schema.getPlural(); %>;
};

module.exports.read = read;
module.exports.middleware = middleware;
module.exports.readNullable = readNullable;

//
// read model by id
// Return the data or throws (to next)
//
function read(id, req, res, next) {
  model.findById(id, function(err, entity) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    if (!entity) {
      return next(new HttpError(404, 'Not found'));
    }

    return next(null, entity);
  });
}

function middleware(storeAt) {
  return function(req, res, next) {
    const id = req.params['<%= schema.apiIdParam %>'];

    return read(id, req, res, function(err, output) {
      /* istanbul ignore next */ if (err) {
        return next(err);
      }

      req[storeAt] = output;
      return next();
    });
  };
}


/* istanbul ignore next */
function readNullable(meta, id, req, res, next) {
  model.findById(id, function(err, entity) {
    if (err) {
      return next(err);
    }

    if (!entity) {
      entity = null;
    }

    return next(null, entity);
  });
}
