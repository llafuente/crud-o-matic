import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { Voucher, IVoucherModel } from "../models/Voucher";
import { Schema } from "mongoose";

export function read(_id: Schema.Types.ObjectId | string, next) {
  return Voucher.findById(_id, function(err, entity: IVoucherModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    if (!entity) {
      return next(new HttpError(404, "Not found"));
    }

    return next(null, entity);
  });
}

export function readNullable(_id: Schema.Types.ObjectId | string, next) {
  return Voucher.findById(_id, function(err, entity) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    if (!entity) {
      entity = null;
    }

    return next(null, entity);
  });
}

export function readVoucher(req: Request, res: express.Response, next: express.NextFunction) {
  const id = req.params.voucherId;
  console.info("read", id);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  return read(id, function(err, savedRow: IVoucherModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("read@database", savedRow);

    // TODO review, use custom type...
    req.voucher = savedRow;
    return next();
  });
}