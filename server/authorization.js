

module.exports = {
  authorization: authorization,
  hasPermission: hasPermission,
  hasRole: hasRole
};

const HttpError = require('./http-error.js');
const _ = require('lodash');

// NOTE every middleware has an err parameter
// NOTE use it to be less specific about the nature of the error

function authorization(err) {
  return function requireAuthorization(req, res, next) {
    if (!req.user) {
      return next(err || new HttpError(401, 'authorization is required'));
    }

    return next();
  };
}

function hasPermission(perm, err) {
  if (!Array.isArray(perm)) {
    perm = [perm];
  }

  return function mustHavePermission(req, res, next) {
    if (!req.user) {
      /* istanbul ignore next */
      return next(err || new HttpError(401, 'authorization is required'));
    }

    if (!req.user.permissions) {
      /* istanbul ignore next */
      return next(err || new HttpError(403, 'invalid user'));
    }

    // check @permissions and @roles.permissions
    let i;
    for (i = 0; i < perm.length; ++i) {
      if (!req.user.hasPermission(perm[i])) {
        return next(err || new HttpError(403, ['permission required', perm[i]]));
      }
    }

    return next();
  };
}

function hasRole(role, err) {
  if (!Array.isArray(role)) {
    role = [role];
  }

  return function mustHaveRole(req, res, next) {
    if (!req.user) {
      /* istanbul ignore next */
      return next(err || new HttpError(401, 'authorization is required'));
    }

    if (!req.user.roles) {
      /* istanbul ignore next */
      return next(err || new HttpError(403, 'invalid user'));
    }

    let i;
    let roles = req.user.roles;
    if (req.user.populated('roles')) {
      roles = _.map(req.user.roles, '_id');
    }

    for (i = 0; i < role.length; ++i) {
      if (roles.indexOf(role[i]) === -1) {
        return next(err || new HttpError(403, ['role required', role[i]]));
      }
    }

    return next();
  };
}
