import * as express from "express";
import { Request } from "../app";
import { <%= backend.createFunction %> } from "./<%= backend.createFunction %>";
import { <%= backend.readFunction %> } from "./<%= backend.readFunction %>";
import { <%= backend.updateFunction %>, <%= backend.cloneFunction %> } from "./<%= backend.updateFunction %>";
import { <%= backend.listFunction %> } from "./<%= backend.listFunction %>";
import { <%= backend.deleteFunction %> } from "./<%= backend.deleteFunction %>";
import { <%= backend.csvImportFunction %> } from "./<%= backend.csvImportFunction %>";
import { <%= interfaceModel %> } from '../models/<%= singularUc %>';
import { Pagination } from '../common';
import { authorization } from '../auth';
const mongoosemask = require("mongoosemask");
var multer  = require('multer');
var upload = multer({
  /* dest: 'uploads/' }*/
  storage: multer.memoryStorage()
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

export function toJSONList(result: Pagination<<%= interfaceModel %>>) {
  result.list = result.list.map(toJSON);

  return result;
}

export function toJSON(entity: <%= interfaceModel %>) {
  let json = mongoosemask.mask(entity, <%- JSON.stringify(getBackEndBlacklist('read')) %>);

  json.id = json._id;
  delete json._id;

  return json;
}

const <%= backend.routerName %> = express.Router()
.use(authorization(null))
.post(
  '<%= url("IMPORT") %>',
  upload.single('file'),
  <%= backend.csvImportFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).json();
  }
)
.post(
  '<%= url("CLONE") %>',
  cleanBody,
  <%= backend.readFunction %>,
  <%= backend.cloneFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req[<%- JSON.stringify(singular) %>]);
  }
)
.post(
  '<%= url("CREATE") %>',
  cleanBody,
  <%= backend.createFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req[<%- JSON.stringify(singular) %>]));
  }
)
.get(
  '<%= url("LIST") %>',
  <%= backend.listFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req[<%- JSON.stringify(plural) %>]));
  }
)
.get(
  '<%= url("READ") %>',
  <%= backend.readFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req[<%- JSON.stringify(singular) %>]));
  }
)
.patch(
  '<%= url("UPDATE") %>',
  cleanBody,
  <%= backend.readFunction %>,
  <%= backend.updateFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req[<%- JSON.stringify(singular) %>]);
  }
)
.delete(
  '<%= url("DELETE") %>',
  <%= backend.deleteFunction %>,
  function (req: Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router <%= backend.routerName %>");

export default <%= backend.routerName %>;

