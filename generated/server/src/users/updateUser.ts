import * as express from "express";
import { Request } from '../app';
import { HttpError } from '../HttpError';
import { IUser } from '../models/IUser';
import { IUserModel } from '../models/User';

interface IUpdateCB {
  (err: Error|HttpError, savedRow?: IUserModel)
};

export function update(/*user,*/ row: IUserModel, data, next: IUpdateCB) {
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
      return next(new HttpError(422, 'database don\'t return data'));
    }

    return next(null, savedRow);
  });
}

export function updateUser(req: Request, res: express.Response, next: express.NextFunction) {
  console.info('update body', req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, 'body is an array'));
  }

  if (!req["user"]) {
   return next(new HttpError(500, 'Cannot fetch user'));
  }

  return update(/*req.user, */req["user"], req.body, function(err, savedRow: IUserModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info('created@database', savedRow);

    req["user"] = savedRow;
    return next();
  });
}


