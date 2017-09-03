import * as express from "express";
import { Request } from "../app";
import { createVoucher } from "./createVoucher";
import { readVoucher } from "./readVoucher";
import { updateVoucher } from "./updateVoucher";
import { listVoucher } from "./listVoucher";
import { destroyVoucher } from "./destroyVoucher";
import { IVoucherModel } from '../models/Voucher';
import { Pagination } from '../common';
import { authorization } from '../auth';
const mongoosemask = require("mongoosemask");

/**
 * clean req.body from data that never must be created/updated
 */
export function cleanBody(req: Request, res: express.Response, next: express.NextFunction) {
  delete req.body._id;
  //delete body.id;
  delete req.body.__v;

  delete req.body.create_at;
  delete req.body.updated_at;
  next();
}

export function toJSONList(result: Pagination<IVoucherModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: IVoucherModel) {
  let json = mongoosemask.mask(entity, []);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerVoucher = express.Router()
.use(authorization(null))
.post(
  '/vouchers',
  cleanBody,
  createVoucher,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req["voucher"]));
  }
)
.get(
  '/vouchers',
  listVoucher,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req["vouchers"]));
  }
)
.get(
  '/vouchers/:voucherId',
  readVoucher,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req["voucher"]));
  }
)
.patch(
  '/vouchers/:voucherId',
  cleanBody,
  readVoucher,
  updateVoucher,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["voucher"]);
  }
)
.delete(
  '/vouchers/:voucherId',
  destroyVoucher,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router routerVoucher");

export default routerVoucher;

