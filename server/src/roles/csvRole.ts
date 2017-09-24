import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { Role } from "../models/Role";
const parse = require("csv-parse/lib/sync");

export function CSVImport(inputData: string, delimeter: string, escape: string, next) {
  console.info("CSV role data\n", inputData, "\n");
  console.info("delimeter", delimeter, "escape", escape);

  const dataList = parse(inputData, {
    columns: true,
    comment: "#",
    delimiter: delimeter,
    escape: escape,
  });

  console.log(dataList);
  dataList.forEach((singleData) => {
    Role.create(singleData, function(err, savedRow) {
      if (err) {
        console.log(err);
      }
    });
  });

  setTimeout(() => {
    return next(null);
  }, 5000);
}

export function csvRole(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("csv import body", req.body);

  if (!req.file) {
    return next(new HttpError(422, "Excepted an attachment"));
  }

  return CSVImport(req.file.buffer.toString(), req.body.delimeter || ";", req.body.escape || "\"", function(
    err,
    savedRow,
  ) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.role = savedRow;
    return next();
  });
}
