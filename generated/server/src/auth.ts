import { HttpError } from "./HttpError";
import { Request } from "./app";
import * as express from "express";
import { IUserModel } from "./models/User";
//const _ = require("lodash");

// NOTE every middleware has an err parameter
// NOTE use it to be less specific about the nature of the error

export function authorization(err) {
  return function requireAuthorization(req: Request, res: express.Response, next: express.NextFunction) {
    if (!req.loggedUser) {
      return next(err || new HttpError(401, "authorization is required"));
    }

    return next();
  };
}

export function hasPermission(perm, err) {
  if (!Array.isArray(perm)) {
    perm = [perm];
  }

  return function mustHavePermission(req: Request, res: express.Response, next: express.NextFunction) {
    const user: IUserModel = req.loggedUser;

    if (!user) {
      /* istanbul ignore next */
      return next(err || new HttpError(401, "authorization is required"));
    }

    //    if (!user.permissions) {
    //      /* istanbul ignore next */
    //      return next(err || new HttpError(403, 'invalid user'));
    //    }
    //
    //    // check @permissions and @role.permissions
    //    let i;
    //    for (i = 0; i < perm.length; ++i) {
    //      if (!user.hasPermission(perm[i])) {
    //        return next(err || new HttpError(403, "permission required: " + perm[i]));
    //      }
    //    }

    return next();
  };
}

export function hasRole(role, err) {
  /* TODO need REVIEW
  if (!Array.isArray(role)) {
    role = [role];
  }

  return function mustHaveRole(req: Request, res: express.Response, next: express.NextFunction) {
    const user: IUserModel = req.loggedUser;

    if (!user) {
      return next(err || new HttpError(401, 'authorization is required'));
    }

    if (!user.role) {
      return next(err || new HttpError(403, 'invalid user'));
    }

    let i;
    let role = user.role;
    if (user.populated('role')) {
      role = _.map(user.role, '_id');
    }

    for (i = 0; i < role.length; ++i) {
      if (role.indexOf(role[i]) === -1) {
        return next(err || new HttpError(403, "role required: " + role[i]));
      }
    }

    return next();
  };
  */
}
