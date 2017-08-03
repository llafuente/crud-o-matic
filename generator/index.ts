import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Schema } from './Schema';
const _ = require('lodash');

export class Generator {
  schema: Schema = null;

  constructor() {
  }

  fromJSON(JSONFile: string) {
    const obj = require(JSONFile);
    this.fromObject(obj);
  }

  fromObject(obj: any) {
    this.schema = new Schema(obj);
  }

  templatePass(srcFile:string, dstFile: string) {
    console.log(srcFile, dstFile);

    const model = readFileSync(srcFile, {encoding: "utf8"});
    const modelTpl = _.template(model);
    const str = modelTpl(this.schema);
    writeFileSync(dstFile, str);
  }

  copy(src:string, dst:string) {
    const model = readFileSync(src, {encoding: "utf8"});
    writeFileSync(dst, model);
  }


  generateServerAt(path: string) {
    // put _ into templates
    (this.schema as any)._ = _;

    this.copy(
      join(__dirname, "../templates/express/HttpError.ts"),
      join(path, `HttpError.ts`),
    );
    this.copy(
      join(__dirname, "../templates/common.ts"),
      join(path, `../common.ts`),
    );


    this.templatePass(
      join(__dirname, "../templates/mongoose/model.ejs"),
      join(path, `${this.schema.entitySingularUc}.ts`)
    );

    this.templatePass(
      join(__dirname, "../templates/express/create.ejs"),
      join(path, this.schema.createFilename)
    );

    this.templatePass(
      join(__dirname, "../templates/express/destroy.ejs"),
      join(path, this.schema.deleteFilename)
    );

    this.templatePass(
      join(__dirname, "../templates/express/read.ejs"),
      join(path, this.schema.readFilename)
    );

    this.templatePass(
      join(__dirname, "../templates/express/list.ejs"),
      join(path, this.schema.listFilename)
    );

    this.templatePass(
      join(__dirname, "../templates/express/update.ejs"),
      join(path, this.schema.updateFilename)
    );

    this.templatePass(
      join(__dirname, "../templates/express/Router.ejs"),
      join(path, this.schema.routerFilename)
    );
  }

  generateClientAt(path: string) {

  }
}
