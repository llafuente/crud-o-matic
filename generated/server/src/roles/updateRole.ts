import * as express from "express";
import { Request } from '../app';
import { HttpError } from '../HttpError';
import { IRole } from '../models/IRole';
import { IRoleModel } from '../models/Role';

interface IUpdateCB {
  (err: Error|HttpError, savedRow?: IRoleModel)
};

export function update(/*user,*/ row: IRoleModel, data, next: IUpdateCB) {
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

export function updateRole(req: Request, res: express.Response, next: express.NextFunction) {
  console.info('update body', req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, 'body is an array'));
  }

  if (!req["role"]) {
   return next(new HttpError(500, 'Cannot fetch role'));
  }

  return update(/*req.user, */req["role"], req.body, function(err, savedRow: IRoleModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info('created@database', savedRow);

    req["role"] = savedRow;
    return next();
  });
}


