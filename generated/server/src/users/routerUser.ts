import * as express from "express";
import { Request } from "../app";
import { createUser } from "./createUser";
import { readUser } from "./readUser";
import { updateUser } from "./updateUser";
import { listUser } from "./listUser";
import { destroyUser } from "./destroyUser";
import { IUserModel } from "../models/User";
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

export function toJSONList(result: Pagination<IUserModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: IUserModel) {
  const json = mongoosemask.mask(entity, ["password", "salt"]);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerUser = express
  .Router()
  .use(authorization(null))
  .post("/users", cleanBody, createUser, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req.user));
  })
  .get("/users", listUser, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req.users));
  })
  .get("/users/:userId", readUser, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req.user));
  })
  .patch("/users/:userId", cleanBody, readUser, updateUser, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.user);
  })
  .delete("/users/:userId", destroyUser, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  });

console.log("express create router routerUser");

export default routerUser;
