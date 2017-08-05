import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Schema } from './Schema';
const _ = require('lodash');
var mkdirp = require('mkdirp');



export class Generator {
  schemas: Schema[] = [];

  constructor() {
  }

  addSchema(schema: Schema) {
    this.schemas.push(schema);
  }

  template(schema: Schema, srcFile:string, dstFile: string) {
    console.log(srcFile, dstFile);

    const model = readFileSync(srcFile, {encoding: "utf8"});
    const modelTpl = _.template(model);
    const str = modelTpl(schema);
    writeFileSync(dstFile, str);
  }

  copy(src:string, dst:string) {
    const model = readFileSync(src, {encoding: "utf8"});
    writeFileSync(dst, model);
  }

  generateAll(commonPath: string, serverPath: string, clientPath: string) {
    this.schemas.forEach((schema) => {
      this.generateCommonAt(schema, commonPath);
      this.generateServerAt(schema, serverPath);
      this.generateClientAt(schema, clientPath);
    });
  }


  generateCommonAt(schema: Schema, path: string) {
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
      schema,
      join(__dirname, "../templates/Type.ts"),
      join(path, "models", `${schema.interfaceName}.ts`)
    );
  }
  generateServerAt(schema: Schema, path: string) {
    try {
      mkdirp.sync(path);
      mkdirp.sync(join(path, schema.plural));
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


    this.template(
      schema,
      join(__dirname, "../templates/mongoose/model.ejs"),
      join(path, schema.plural, `${schema.singularUc}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/create.ejs"),
      join(path, schema.plural, `${schema.backend.createFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/destroy.ejs"),
      join(path, schema.plural, `${schema.backend.deleteFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/read.ejs"),
      join(path, schema.plural, `${schema.backend.readFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/list.ejs"),
      join(path, schema.plural, `${schema.backend.listFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/update.ejs"),
      join(path, schema.plural, `${schema.backend.updateFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/Router.ejs"),
      join(path, schema.plural, `${schema.backend.routerName}.ts`)
    );
  }

  generateClientAt(schema: Schema, path: string) {
    try {
      mkdirp.sync(join(path, schema.plural));
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
      schema,
      join(__dirname, "../templates/angular/index.ts"),
      join(path, schema.plural, "index.ts")
    );

    this.template(
      schema,
      join(__dirname, "../templates/angular/routes.ts"),
      join(path, schema.plural, "routes.ts")
    );

    this.template(
      schema,
      join(__dirname, "../templates/angular/createComponent.ts"),
      join(path, schema.plural, `${schema.frontend.createComponent}.ts`)
    );
    this.template(
      schema,
      join(__dirname, "../templates/angular/updateComponent.ts"),
      join(path, schema.plural, `${schema.frontend.updateComponent}.ts`)
    );
    this.template(
      schema,
      join(__dirname, "../templates/angular/listComponent.ts"),
      join(path, schema.plural, `${schema.frontend.listComponent}.ts`)
    );



  }
}
