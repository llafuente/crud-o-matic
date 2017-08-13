import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { ITestModel } from "../models/Test";

interface IUpdateCB {
  (err: Error | HttpError, savedRow?: ITestModel);
}

export function update(/*user,*/ row: ITestModel, data, next: IUpdateCB) {
  // TODO
  //data = meta.$express.restricted_filter(log, user, 'update', data);

  // TODO review this!
  row.set(data);

  row.save(function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    /* istanbul ignore next */
    if (!savedRow) {
      return next(new HttpError(422, "database don't return data"));
    }

    return next(null, savedRow);
  });
}

export function updateTest(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("update body", req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  if (!req.test) {
    return next(new HttpError(500, "Cannot fetch test"));
  }

  return update(/*req.user, */ req.test, req.body, function(err, savedRow: ITestModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.test = savedRow;
    return next();
  });
}
