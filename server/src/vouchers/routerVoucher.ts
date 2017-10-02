import * as express from "express";
import * as path from "path";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { createVoucher } from "./createVoucher";
import { readVoucher } from "./readVoucher";
import { updateVoucher, cloneVoucher } from "./updateVoucher";
import { listVoucher } from "./listVoucher";
import { destroyVoucher } from "./destroyVoucher";
import { csvVoucher, xmlVoucher } from "./csvVoucher";
import { IVoucherModel } from "../models/Voucher";
import { Pagination } from "../common";
import { authorization } from "../auth";
const mongoosemask = require("mongoosemask");
let multer = require("multer");
let upload = multer({
  /* dest: 'uploads/' }*/
  storage: multer.memoryStorage(),
});

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
  const json = mongoosemask.mask(entity, []);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerVoucher = express
  .Router()
  .use(authorization(null))
  .post(
    "/api/v1/vouchers/csv",
    upload.single("file"),
    function(req: Request, res: express.Response, next: express.NextFunction) {
      if (!req.file) {
        return next(new HttpError(422, "Excepted an attachment"));
      }

      console.log("\n\n\n\n\n\n\n\n");
      console.log("req.file", req.file);
      console.log("\n\n\n\n\n");

      switch (path.extname(req.file.originalname)) {
        case ".csv":
          csvVoucher(req, res, next);
          break;
        case ".xml":
          xmlVoucher(req, res, next);
          break;
        default:
          return next(new HttpError(422, "Unsupported format: csv & xml"));
      }
    },
    function(req: Request, res: express.Response, next: express.NextFunction) {
      res.status(204).json();
    },
  )
  .post("/api/v1/vouchers/:voucherId/clone", cleanBody, readVoucher, cloneVoucher, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.voucher);
  })
  .post("/api/v1/vouchers", cleanBody, createVoucher, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(201).json(toJSON(req.voucher));
  })
  .get("/api/v1/vouchers", listVoucher, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req.vouchers));
  })
  .get("/api/v1/vouchers/:voucherId", readVoucher, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(toJSON(req.voucher));
  })
  .patch("/api/v1/vouchers/:voucherId", cleanBody, readVoucher, updateVoucher, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.voucher);
  })
  .delete("/api/v1/vouchers/:voucherId", destroyVoucher, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(204).send();
  });

console.log("express create router routerVoucher");

export default routerVoucher;
