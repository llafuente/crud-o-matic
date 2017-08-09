import { HttpError } from "./HttpError";
import * as express from "express";
import { IUserModel } from "models/User";
const _ = require("lodash");

// NOTE every middleware has an err parameter
// NOTE use it to be less specific about the nature of the error

export function authorization(err) {
  return function requireAuthorization(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req["user"]) {
      return next(err || new HttpError(401, "authorization is required"));
    }

    return next();
  };
}

export function hasPermission(perm, err) {
  if (!Array.isArray(perm)) {
    perm = [perm];
  }

  return function mustHavePermission(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user: IUserModel = req["user"];

    if (!user) {
      /* istanbul ignore next */
      return next(err || new HttpError(401, "authorization is required"));
    }

    if (!user.permissions) {
      /* istanbul ignore next */
      return next(err || new HttpError(403, "invalid user"));
    }

    // check @permissions and @roles.permissions
    let i;
    for (i = 0; i < perm.length; ++i) {
      if (!user.hasPermission(perm[i])) {
        return next(err || new HttpError(403, "permission required: " + perm[i]));
      }
    }

    return next();
  };
}

export function hasRole(role, err) {
  if (!Array.isArray(role)) {
    role = [role];
  }

  return function mustHaveRole(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user: IUserModel = req["user"];

    if (!user) {
      /* istanbul ignore next */
      return next(err || new HttpError(401, "authorization is required"));
    }

    if (!user.roles) {
      /* istanbul ignore next */
      return next(err || new HttpError(403, "invalid user"));
    }

    let i;
    let roles = user.roles;
    if (user.populated("roles")) {
      roles = _.map(user.roles, "_id");
    }

    for (i = 0; i < role.length; ++i) {
      if (roles.indexOf(role[i]) === -1) {
        return next(err || new HttpError(403, "role required: " + role[i]));
      }
    }

    return next();
  };
}
