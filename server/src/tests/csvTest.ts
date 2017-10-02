import * as express from "express";
import { Request } from "../app";
import { HttpError } from "../HttpError";
import { ITest } from "../models/ITest";
import { Test } from "../models/Test";
const parse = require("csv-parse/lib/sync");
const XLSX = require("xlsx");
const async = require("async");

export function importList(list: ITest[], next) {
  console.log("importList", list);

  async.each(
    list,
    function(data, callback) {
      Test.create(data, function(err, savedRow) {
        if (err) {
          console.log(err);
          return callback(err);
        }

        return callback();
      });
    },
    function(err) {
      return next(err);
    },
  );
}

export function csvTest(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("csv import body", req.body);

  if (!req.file) {
    return next(new HttpError(422, "Excepted an attachment"));
  }

  const dataList = parse(req.file.buffer.toString(), {
    columns: true,
    comment: "#",
    delimiter: req.body.delimeter || ";",
    escape: req.body.escape || "\"",
  });

  return importList(dataList, function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.test = savedRow;
    return next();
  });
}

export function xmlTest(req: Request, res: express.Response, next: express.NextFunction) {
  console.info("xml import body", req.body);

  if (!req.file) {
    return next(new HttpError(422, "Excepted an attachment"));
  }

  let workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheets = Object.keys(workbook.Sheets);
  if (workbook.SheetNames.length > 1) {
    return next(new HttpError(422, "Can only import one sheet page"));
  }

  console.log(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]));

  const dataList = parse(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]), {
    columns: true,
    comment: "#",
  });

  return importList(dataList, function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info("created@database", savedRow);

    req.test = savedRow;
    return next();
  });
}
