import * as express from "express";
import { HttpError } from '../HttpError';
import { <%= interfaceName %> } from '../models/<%= interfaceName %>';
import { <%= singularUc %> } from '../models/<%= singularUc %>';
import { Schema } from 'mongoose';


export function destroy(_id: Schema.Types.ObjectId|string, next) {
  <%= singularUc %>.findByIdAndRemove(_id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

export function <%= backend.deleteFunction %>(req: express.Request, res: express.Response, next: express.NextFunction) {
  const id = req.params['<%= entityId %>'];

  console.info(`destroy`, id);

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
