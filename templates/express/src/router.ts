import * as express from "express";
import { <%= backend.createFunction %> } from "./<%= backend.createFunction %>";
import { <%= backend.readFunction %> } from "./<%= backend.readFunction %>";
import { <%= backend.updateFunction %> } from "./<%= backend.updateFunction %>";
import { <%= backend.listFunction %> } from "./<%= backend.listFunction %>";
import { <%= backend.deleteFunction %> } from "./<%= backend.deleteFunction %>";

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

const <%= backend.routerName %> = express.Router();
<%= backend.routerName %>.post(
  '<%= url("CREATE") %>',
  cleanBody,
  <%= backend.createFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(201).json(req[<%= JSON.stringify(singular) %>]);
  }
);
<%= backend.routerName %>.get(
  '<%= url("LIST") %>',
  <%= backend.listFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req[<%= JSON.stringify(plural) %>]);
  }
);
<%= backend.routerName %>.get(
  '<%= url("READ") %>',
  <%= backend.readFunction %>,
  function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(200).json(req[<%= JSON.stringify(singular) %>]);
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

