import * as express from "express";
import * as path from "path";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { createTest } from "./createTest";
import { readTest } from "./readTest";
import { updateTest, cloneTest } from "./updateTest";
import { listTest } from "./listTest";
import { destroyTest } from "./destroyTest";
import { csvTest, xmlTest } from "./csvTest";
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
  .post(
    "/api/v1/tests/csv",
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
          csvTest(req, res, next);
          break;
        case ".xml":
          xmlTest(req, res, next);
          break;
        default:
          return next(new HttpError(422, "Unsupported format: csv & xml"));
      }
    },
    function(req: Request, res: express.Response, next: express.NextFunction) {
      res.status(204).json();
    },
  )
  .post("/api/v1/tests/:testId/clone", cleanBody, readTest, cloneTest, function(
    req: Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.status(200).json(req.test);
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
