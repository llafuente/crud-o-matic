import * as express from "express";
import { Test } from "../models/Test";
import { Schema } from "mongoose";

export function destroy(_id: Schema.Types.ObjectId | string, next) {
  Test.findByIdAndRemove(_id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

export function destroyTest(req: express.Request, res: express.Response, next: express.NextFunction) {
  const id = req.params.testId;

  console.info(`destroy`, id);

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
