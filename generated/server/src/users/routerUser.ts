import * as express from "express";
import { createUser } from "./createUser";
import { readUser } from "./readUser";
import { updateUser } from "./updateUser";
import { listUser } from "./listUser";
import { destroyUser } from "./destroyUser";
import { IUserModel } from '../models/User';
import { Pagination } from '../common';
const mongoosemask = require("mongoosemask");

/**
 * clean req.body from data that never must be created/updated
 */
export function cleanBody(req: express.Request, res: express.Response, next: express.NextFunction) {
  delete req.body._id;
  //delete body.id;
  delete req.body.__v;

  delete req.body.create_at;
  delete req.body.updated_at;
  next();
}

function toJSONList(result: Pagination<IUserModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

function toJSON(entity: IUserModel) {
  let json = mongoosemask.mask(entity, ["password","salt"]);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerUser = express.Router();
routerUser.post(
  '/users',
  cleanBody,
  createUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req["user"]));
  }
);
routerUser.get(
  '/users',
  listUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req["users"]));
  }
);
routerUser.get(
  '/users/:userId',
  readUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req["user"]));
  }
);
routerUser.patch(
  '/users/:userId',
  cleanBody,
  readUser,
  updateUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["user"]);
  }
);
routerUser.delete(
  '/users/:userId',
  destroyUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router routerUser");

export default routerUser;

