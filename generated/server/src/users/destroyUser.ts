import * as express from "express";
import { HttpError } from '../HttpError';
import { IUser } from '../models/IUser';
import { User } from '../models/User';
import { Schema } from 'mongoose';


export function destroy(_id: Schema.Types.ObjectId|string, next) {
  User.findByIdAndRemove(_id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

export function destroyUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const id = req.params['userId'];

  console.info(`destroy`, id);

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
