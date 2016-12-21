let model;
//let schema;

module.exports = function(mongoose) {
  model = mongoose.models.<%= schema.getPlural(); %>;
  //schema = mongoose.modelSchemas.<%= schema.getPlural(); %>;
};

module.exports.destroy = destroy;
module.exports.middleware = destroyMiddleware;

function destroy(id, next) {
  model.findByIdAndRemove(id, function(err) {
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
