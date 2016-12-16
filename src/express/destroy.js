const mongoose = require("mongoose");

module.exports = destroy;
module.exports.middleware = destroyMiddleware;

function destroy(id, next) {
  mongoose.models['<%= schema.getName() %>'].findByIdAndRemove(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

function destroyMiddleware(req, res, next) {
  const id = req.params['<%= schema.apiIdParam %>'];
  $log.info(`destroy`, id);
  // TODO int validation?!

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
