import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { IUser } from "../models/IUser";
import { User } from "../models/User";

export function create(data: IUser, next) {
  console.info("create user data", data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return User.create(data, function(err, savedRow) {
    if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!savedRow) {
      return next(new HttpError(500, "database don't return data"));
    }

    return next(null, savedRow);
  });
}

export function createUser(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("create body", req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  return create(req.body, function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.user = savedRow;
    return next();
  });
}
