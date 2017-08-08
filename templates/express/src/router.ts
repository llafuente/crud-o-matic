import * as express from "express";
import { <%= backend.createFunction %> } from "./<%= backend.createFunction %>";
import { <%= backend.readFunction %> } from "./<%= backend.readFunction %>";
import { <%= backend.updateFunction %> } from "./<%= backend.updateFunction %>";
import { <%= backend.listFunction %> } from "./<%= backend.listFunction %>";
import { <%= backend.deleteFunction %> } from "./<%= backend.deleteFunction %>";
import { <%= interfaceModel %> } from '../models/<%= singularUc %>';
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

function toJSONList(result: Pagination<<%= interfaceModel %>>) {
  result.list = result.list.map(toJSON);

  return result;
}

function toJSON(entity: <%= interfaceModel %>) {
  let json = mongoosemask.mask(entity, <%= JSON.stringify(getBackEndBlacklist('read')) %>);

  json.id = json._id;
  delete json._id;

  return json;
}

const <%= backend.routerName %> = express.Router();
<%= backend.routerName %>.post(
  '<%= url("CREATE") %>',
  cleanBody,
  <%= backend.createFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(toJSON(req[<%= JSON.stringify(singular) %>]));
  }
);
<%= backend.routerName %>.get(
  '<%= url("LIST") %>',
  <%= backend.listFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSONList(req[<%= JSON.stringify(plural) %>]));
  }
);
<%= backend.routerName %>.get(
  '<%= url("READ") %>',
  <%= backend.readFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(toJSON(req[<%= JSON.stringify(singular) %>]));
  }
);
<%= backend.routerName %>.patch(
  '<%= url("UPDATE") %>',
  cleanBody,
  <%= backend.readFunction %>,
  <%= backend.updateFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req[<%= JSON.stringify(singular) %>]);
  }
);
<%= backend.routerName %>.delete(
  '<%= url("DELETE") %>',
  <%= backend.deleteFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(204).send();
  }
);

console.log("express create router <%= backend.routerName %>");

export default <%= backend.routerName %>;

