import * as express from "express";
import { Role } from "../models/Role";
import { Schema } from "mongoose";

export function destroy(_id: Schema.Types.ObjectId | string, next) {
  Role.findByIdAndRemove(_id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

export function destroyRole(req: express.Request, res: express.Response, next: express.NextFunction) {
  const id = req.params.roleId;

  console.info(`destroy`, id);

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
