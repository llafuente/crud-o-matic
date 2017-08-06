import * as express from "express";
import { HttpError } from '../HttpError';
import { <%= interfaceName %> } from '../models/<%= interfaceName %>';
import { <%= interfaceModel %> } from '../models/<%= singularUc %>';

interface IUpdateCB {
  (err: Error|HttpError, savedRow?: <%= interfaceModel %>)
};

export function update(/*user,*/ row: <%= interfaceModel %>, data, next: IUpdateCB) {
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

export function <%= backend.updateFunction %>(req: express.Request, res: express.Response, next: express.NextFunction) {
  console.info('update body', req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, 'body is an array'));
  }

  if (!req[<%= JSON.stringify(singular) %>]) {
   return next(new HttpError(500, 'Cannot fetch <%= singular %>'));
  }

  return update(/*req.user, */req[<%= JSON.stringify(singular) %>], req.body, function(err, savedRow: <%= interfaceModel %>) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info('created@database', savedRow);

    req[<%= JSON.stringify(singular) %>] = savedRow;
    return next();
  });
}


