import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { ITest } from "../models/ITest";
import { Test } from "../models/Test";

export function create(data: ITest, next) {
  console.info("create test data", data);

  // TODO remove restricted
  //data = meta.$express.restricted_filter(req.log, req.user, 'create', data);

  return Test.create(data, function(err, savedRow) {
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

export function createTest(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("create body", req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  return create(req.body, function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.test = savedRow;
    return next();
  });
}
