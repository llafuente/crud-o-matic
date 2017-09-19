import * as express from "express";
import { Voucher } from "../models/Voucher";
import { Schema } from "mongoose";

export function destroy(_id: Schema.Types.ObjectId | string, next) {
  Voucher.findByIdAndRemove(_id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next(null);
  });
}

export function destroyVoucher(req: express.Request, res: express.Response, next: express.NextFunction) {
  const id = req.params.voucherId;

  console.info(`destroy`, id);

  return destroy(id, function(err) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    return next();
  });
}
