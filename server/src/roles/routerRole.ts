import * as express from "express";
import * as path from "path";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { createRole } from "./createRole";
import { readRole } from "./readRole";
import { updateRole, cloneRole } from "./updateRole";
import { listRole } from "./listRole";
import { destroyRole } from "./destroyRole";
import { csvRole, xmlRole } from "./csvRole";
import { IRoleModel } from "../models/Role";
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

export function toJSONList(result: Pagination<IRoleModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: IRoleModel) {
  const json = mongoosemask.mask(entity, []);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerRole = express
  .Router()
  .use(authorization(null))
  .post(
    "/api/v1/roles/csv",
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
          csvRole(req, res, next);
          break;
        case ".xml":
          xmlRole(req, res, next);
          break;
        default:
          return next(new HttpError(422, "Unsupported format: csv & xml"));
      }
    },
    function(req: Request, res: express.Response, next: express.NextFunction) {
      res.status(204).json();
    },
  )
  .post("/api/v1/roles/:roleId/clone", cleanBody, readRole, cloneRole, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.role);
  })
  .post("/api/v1/roles", cleanBody, createRole, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(201).json(toJSON(req.role));
  })
  .get("/api/v1/roles", listRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req.roles));
  })
  .get("/api/v1/roles/:roleId", readRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req.role));
  })
  .patch("/api/v1/roles/:roleId", cleanBody, readRole, updateRole, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.role);
  })
  .delete("/api/v1/roles/:roleId", destroyRole, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(204).send();
  });

console.log("express create router routerRole");

export default routerRole;
