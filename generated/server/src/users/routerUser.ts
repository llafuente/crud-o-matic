import * as express from "express";
import { createUser } from "./createUser";
import { readUser } from "./readUser";
import { updateUser } from "./updateUser";
import { listUser } from "./listUser";
import { destroyUser } from "./destroyUser";

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

const routerUser = express.Router();
routerUser.post(
  '/users',
  cleanBody,
  createUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(req["user"]);
  }
);
routerUser.get(
  '/users',
  listUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["users"]);
  }
);
routerUser.get(
  '/users/:userId',
  readUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["user"]);
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

