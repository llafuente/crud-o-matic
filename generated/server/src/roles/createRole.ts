import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { IRole } from "../models/IRole";
import { Role } from "../models/Role";

export function create(data: IRole, next) {
  console.info("create role data", data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return Role.create(data, function(err, savedRow) {
    if (err) {
      //return next(err);
      console.error(err);
      return next(new HttpError(400, err.message));
    }

    /* istanbul ignore next */
    if (!savedRow) {
      return next(new HttpError(500, "database don't return data"));
    }

    return next(null, savedRow);
  });
}

export function createRole(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("create body", req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  return create(req.body, function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.role = savedRow;
    return next();
  });
}
