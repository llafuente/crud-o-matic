import * as express from "express";
import { Request } from "../app";
import { HttpError } from '../HttpError';
import { <%= interfaceName %> } from '../models/<%= interfaceName %>';
import { <%= singularUc %> } from '../models/<%= singularUc %>';
const parse = require('csv-parse/lib/sync');


export function CSVImport(inputData: string, next) {
  console.info('create <%= singular %> data', inputData);

  const dataList = parse(inputData, {
    columns: true,
    comment: '#'
  });

  console.log(dataList);
  dataList.forEach((singleData) => {
    <%= singularUc %>.create(singleData, function(err, savedRow) {
      if (err) {
        console.log(err);
      }
    });
  });

  setTimeout(() => {
    return next(null);
  }, 5000);
}

export function <%= backend.csvImportFunction %>(req: Request, res: express.Response, next: express.NextFunction) {
  console.info('create body', req.body);

  if (!req.file) {
    return next(new HttpError(422, 'Excepted an attachment'));
  }

  return CSVImport(req.file.buffer.toString(), function(err, savedRow) {
    /* istanbul ignore next */ if (err) {
      return next(err);
    }

    console.info('created@database', savedRow);

    req[<%- JSON.stringify(singular) %>] = savedRow;
    return next();
  });
}

