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

  }

  generateServerAt(schema: Schema, path: string) {
    try {
      mkdirp.sync(path);
      mkdirp.sync(join(path, "src", schema.plural));
      mkdirp.sync(join(path, "src", "models"));
    } catch(e) {

    }

    // at server root
    this.copy(
      join(__dirname, "../templates/express/.gitignore"),
      join(path, ".gitignore"),
    );
    this.copy(
      join(__dirname, "../templates/express/package.json"),
      join(path, "package.json"),
    );
    this.copy(
      join(__dirname, "../templates/express/tsconfig.json"),
      join(path, "tsconfig.json"),
    );

    // src/models
    this.template(
      schema,
      join(__dirname, "../templates/mongoose/model.ts"),
      join(path, "src", "models", `${schema.singularUc}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/Type.ts"),
      join(path, "src", "models", `${schema.interfaceName}.ts`)
    );

    // src
    this.template(
      schema,
      join(__dirname, "../templates/express/src/app.ts"),
      join(path, "src", "app.ts"),
    );

    this.copy(
      join(__dirname, "../templates/common.ts"),
      join(path, "src", "common.ts"),
    );

    this.copy(
      join(__dirname, "../templates/express/src/HttpError.ts"),
      join(path, "src", "HttpError.ts"),
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/create.ts"),
      join(path, "src", schema.plural, `${schema.backend.createFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/destroy.ts"),
      join(path, "src", schema.plural, `${schema.backend.deleteFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/read.ts"),
      join(path, "src", schema.plural, `${schema.backend.readFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/list.ts"),
      join(path, "src", schema.plural, `${schema.backend.listFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/update.ts"),
      join(path, "src", schema.plural, `${schema.backend.updateFunction}.ts`)
    );

    this.template(
      schema,
      join(__dirname, "../templates/express/src/router.ts"),
      join(path, "src", schema.plural, `${schema.backend.routerName}.ts`)
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
