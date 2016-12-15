const mongoose = require("mongoose");
module.exports = destroyMiddleware;
module.exports.destroy = destroy;

function destroy(id, next) {
  mongoose.models['<%= schema.getName() %>'].findByIdAndRemove(id, function(err, data) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    next(null);
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

    res.status(204).json();
  });
}
