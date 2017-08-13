import * as express from "express";
import { Request } from "../app";
import { createRole } from "./createRole";
import { readRole } from "./readRole";
import { updateRole } from "./updateRole";
import { listRole } from "./listRole";
import { destroyRole } from "./destroyRole";
import { IRoleModel } from "../models/Role";
import { Pagination } from "../common";
import { authorization } from "../auth";
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
  .post("/roles", cleanBody, createRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req.role));
  })
  .get("/roles", listRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req.roles));
  })
  .get("/roles/:roleId", readRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req.role));
  })
  .patch("/roles/:roleId", cleanBody, readRole, updateRole, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.role);
  })
  .delete("/roles/:roleId", destroyRole, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  });

console.log("express create router routerRole");

export default routerRole;
