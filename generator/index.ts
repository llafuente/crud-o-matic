import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Schema } from './Schema';
const _ = require('lodash');
var mkdirp = require('mkdirp');



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

  template(srcFile:string, dstFile: string) {
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


  generateCommonAt(path: string) {
    try {
      mkdirp.sync(path);
      mkdirp.sync(join(path, "models"));
    } catch(e) {

    }

    this.copy(
      join(__dirname, "../templates/common.ts"),
      join(path, `common.ts`),
    );

    this.template(
      join(__dirname, "../templates/Type.ts"),
      join(path, "models", `${this.schema.interfaceName}.ts`)
    );
  }
  generateServerAt(path: string) {
    try {
      mkdirp.sync(path);
      mkdirp.sync(join(path, this.schema.plural));
    } catch(e) {

    }

    this.copy(
      join(__dirname, "../templates/express/common.ts"),
      join(path, `common.ts`),
    );

    this.copy(
      join(__dirname, "../templates/express/HttpError.ts"),
      join(path, `HttpError.ts`),
    );


    // put _ into templates
    (this.schema as any)._ = _;
    (this.schema as any).ucFirst = function(str): string {
      return str[0].toLocaleUpperCase() + str.substring(1);
    };

    this.template(
      join(__dirname, "../templates/mongoose/model.ejs"),
      join(path, this.schema.plural, `${this.schema.singularUc}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/create.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.createFunction}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/destroy.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.deleteFunction}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/read.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.readFunction}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/list.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.listFunction}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/update.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.updateFunction}.ts`)
    );

    this.template(
      join(__dirname, "../templates/express/Router.ejs"),
      join(path, this.schema.plural, `${this.schema.backend.routerName}.ts`)
    );
  }

  generateClientAt(path: string) {
    try {
      mkdirp.sync(join(path, this.schema.plural));
    } catch(e) {

    }

    this.copy(
      join(__dirname, "../templates/angular/Root.component.ts"),
      join(path, "Root.component.ts")
    );
    this.copy(
      join(__dirname, "../templates/angular/BaseComponent.ts"),
      join(path, "BaseComponent.ts")
    );

    this.template(
      join(__dirname, "../templates/angular/index.ts"),
      join(path, this.schema.plural, "index.ts")
    );

    this.template(
      join(__dirname, "../templates/angular/routes.ts"),
      join(path, this.schema.plural, "routes.ts")
    );

    this.template(
      join(__dirname, "../templates/angular/createComponent.ts"),
      join(path, this.schema.plural, `${this.schema.frontend.createComponent}.ts`)
    );
    this.template(
      join(__dirname, "../templates/angular/updateComponent.ts"),
      join(path, this.schema.plural, `${this.schema.frontend.updateComponent}.ts`)
    );
    this.template(
      join(__dirname, "../templates/angular/listComponent.ts"),
      join(path, this.schema.plural, `${this.schema.frontend.listComponent}.ts`)
    );



  }
}
