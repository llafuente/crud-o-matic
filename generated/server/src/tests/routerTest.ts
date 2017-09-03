import * as express from "express";
import { Request } from "../app";
import { createTest } from "./createTest";
import { readTest } from "./readTest";
import { updateTest } from "./updateTest";
import { listTest } from "./listTest";
import { destroyTest } from "./destroyTest";
import { ITestModel } from '../models/Test';
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

export function toJSONList(result: Pagination<ITestModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: ITestModel) {
  let json = mongoosemask.mask(entity, []);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerTest = express.Router()
.use(authorization(null))
.post(
  '/tests',
  cleanBody,
  createTest,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req["test"]));
  }
)
.get(
  '/tests',
  listTest,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req["tests"]));
  }
)
.get(
  '/tests/:testId',
  readTest,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req["test"]));
  }
)
.patch(
  '/tests/:testId',
  cleanBody,
  readTest,
  updateTest,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req["test"]);
  }
)
.delete(
  '/tests/:testId',
  destroyTest,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router routerTest");

export default routerTest;

