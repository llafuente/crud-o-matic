import * as express from "express";
import { createUser } from "./createUser";
import { readUser } from "./readUser";
import { updateUser } from "./updateUser";
import { listUser } from "./listUser";
import { destroyUser } from "./destroyUser";

const routerUser = express.Router();
routerUser.post(
  '/user',
  createUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(req["user"]);
  }
);
routerUser.get(
  '/user',
  listUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["users"]);
  }
);
routerUser.get(
  '/user/:userId',
  readUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["user"]);
  }
);
routerUser.patch(
  '/user/:userId',
  readUser,
  updateUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["user"]);
  }
);
routerUser.delete(
  '/user/:userId',
  destroyUser,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router routerUser");

export default routerUser;

