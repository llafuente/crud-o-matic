module.exports = read;
module.exports.middleware = middleware;
module.exports.readNullable = readNullable;

const mongoose = require('mongoose');
const HttpError = require('<%= generatorOptions.componentsPath %>/http-error.js');

//
// read model by id
// Return the data or throws (to next)
//
function read(id, req, res, next) {
  mongoose.models['<%= schema.getName() %>'].findById(id, function(err, entity) {
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
      next();
    });
  };
}


/* istanbul ignore next */
function readNullable(meta, id, req, res, next) {
  meta.$model.findById(id, function(err, entity) {
    if (err) {
      return next(err);
    }

    if (!entity) {
      entity = null;
    }

    return next(null, entity);
  });
}
