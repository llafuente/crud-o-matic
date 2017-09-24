import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { IVoucherModel, Voucher } from "../models/Voucher";

interface IUpdateCB {
  (err: Error | HttpError, savedRow?: IVoucherModel);
}

export function update(/*user,*/ row: IVoucherModel, data, next: IUpdateCB) {
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

export function updateVoucher(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("update body", req.body);

  if (Array.isArray(req.body)) {
    return next(new HttpError(422, "body is an array"));
  }

  if (!req.voucher) {
    return next(new HttpError(500, "Cannot fetch voucher"));
  }

  return update(/*req.user, */ req.voucher, req.body, function(err, savedRow: IVoucherModel) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.voucher = savedRow;
    return next();
  });
}

export function cloneVoucher(req: Request, res: express.Response, next: express.NextFunction) {
  const row = req.voucher;

  if (!row) {
    return next(new HttpError(500, "Cannot fetch voucher"));
  }

  console.info("cloning", row.toJSON());

  row._id = null;
  Voucher.create(row.toJSON(), function(err, savedRow) {
    if (!savedRow) {
      return next(new HttpError(422, "database don't return data"));
    }

    req.voucher = savedRow;
    return next();
  });
}
