import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Schema } from './Schema';
const _ = require('lodash');

function templatePass(srcFile:string, context: any, dstFile: string) {
  console.log(srcFile, dstFile);

  const model = readFileSync(srcFile, {encoding: "utf8"});
  const modelTpl = _.template(model);
  const str = modelTpl(context);
  writeFileSync(dstFile, str);
}

function copy(src:string, dst:string) {
  const model = readFileSync(src, {encoding: "utf8"});
  writeFileSync(dst, model);
}

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

  generateServerAt(path: string) {
    copy(
      join(__dirname, "../templates/express/HttpError.ts"),
      join(path, `HttpError.ts`),
    );
    copy(
      join(__dirname, "../templates/express/cleanBody.ts"),
      join(path, `cleanBody.ts`),
    );
    copy(
      join(__dirname, "../templates/common.ts"),
      join(path, `../common.ts`),
    );



    templatePass(join(__dirname, "../templates/mongoose/model.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, `${this.schema.entitySingularUc}.ts`));

    templatePass(join(__dirname, "../templates/express/create.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.createFilename));

    templatePass(join(__dirname, "../templates/express/destroy.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.deleteFilename));

    templatePass(join(__dirname, "../templates/express/read.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.readFilename));

    templatePass(join(__dirname, "../templates/express/list.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.listFilename));

    templatePass(join(__dirname, "../templates/express/update.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.updateFilename));

    templatePass(join(__dirname, "../templates/express/Router.ejs"), {
      _: _,
      schema: this.schema
    }, join(path, this.schema.backend.routerFilename));
  }

  generateClientAt(path: string) {

  }
}
