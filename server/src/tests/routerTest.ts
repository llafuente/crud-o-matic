import * as express from "express";
import { Request } from "../app";
import { createTest } from "./createTest";
import { readTest } from "./readTest";
import { updateTest } from "./updateTest";
import { listTest } from "./listTest";
import { destroyTest } from "./destroyTest";
import { csvTest } from "./csvTest";
import { ITestModel } from "../models/Test";
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

export function toJSONList(result: Pagination<ITestModel>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: ITestModel) {
  const json = mongoosemask.mask(entity, []);

  json.id = json._id;
  delete json._id;

  return json;
}

const routerTest = express
  .Router()
  .use(authorization(null))
  .post("/api/v1/tests/csv", upload.single("file"), csvTest, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(204).json();
  })
  .post("/api/v1/tests", cleanBody, createTest, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(201).json(toJSON(req.test));
  })
  .get("/api/v1/tests", listTest, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req.tests));
  })
  .get("/api/v1/tests/:testId", readTest, function(req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req.test));
  })
  .patch("/api/v1/tests/:testId", cleanBody, readTest, updateTest, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.test);
  })
  .delete("/api/v1/tests/:testId", destroyTest, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(204).send();
  });

console.log("express create router routerTest");

export default routerTest;
