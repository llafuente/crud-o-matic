import { Schema } from "./Schema";
import { FrontControls } from "./FrontControls";
import { Field } from "./Field";
import { FieldType } from "./FieldType";
import * as fs from "fs";
import * as path from "path";

const ejs = require("ejs");

export class SchemaFront {
  parentSchema: Schema;

  createComponent: string;
  createComponentFile: string;
  listComponent: string;
  listComponentFile: string;
  updateComponent: string;
  updateComponentFile: string;

  constructor(json, parentSchema: Schema) {
    this.parentSchema = parentSchema;

    this.createComponent = `Create${this.parentSchema.singularUc}Component`;
    this.createComponentFile = `Create${this.parentSchema.singularUc}.component`;
    this.listComponent = `List${this.parentSchema.singularUc}Component`;
    this.listComponentFile = `List${this.parentSchema.singularUc}.component`;
    this.updateComponent = `Update${this.parentSchema.singularUc}Component`;
    this.updateComponentFile = `Update${this.parentSchema.singularUc}.component`;
  }

  getCreateControlsHTML(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      controls.push(this.getFieldControlHTML(fieldName, this.parentSchema.fields[fieldName]));
    }

    return controls.join("\n");
  }

  getCreateDeclarations(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      const field = this.parentSchema.fields[fieldName];
      switch (field.frontControl) {
        case FrontControls.HTTP_DROPDOWN:
          controls.push(field.frontData.declaration + ": any;");
          break;
        case FrontControls.ENUM_DROPDOWN:
          const values = field.enums.map((id, idx) => {
            return { id: id, label: field.labels[idx] };
          });

          controls.push(fieldName + "Values: {id: string, label: string}[] = " + JSON.stringify(values));
          break;
        default:
      }
    }

    return controls.join("\n");
  }

  getCreateImports(): string {
    let imports = [];
    for (let fieldName in this.parentSchema.fields) {
      console.log(fieldName, this.parentSchema.fields[fieldName].getCreateImports());
      imports = imports.concat(this.parentSchema.fields[fieldName].getCreateImports());
    }
    console.log(imports);
    return imports.join("\n");
  }

  getCreateInitialization(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      const field = this.parentSchema.fields[fieldName];
      switch (field.frontControl) {
        case FrontControls.HTTP_DROPDOWN:
          controls.push(`
this.http.get("${field.frontData.srcUrl}")
.subscribe((response: any) => {
  console.log("<-- GET: ${field.frontData.srcUrl}", JSON.stringify(response, null, 2));

  this.${field.frontData.declaration} = response;

}, (errorResponse: Response) => {
  console.log("<-- GET Error: ${field.frontData.srcUrl}", errorResponse);
});
`);
          break;
        default:
      }
    }

    return controls.join("\n");
  }

  getCreateControlsTS(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      controls.push(this.getFieldControlTS(fieldName, this.parentSchema.fields[fieldName]));
    }

    return controls.join("\n");
  }

  getFieldControlTS(fieldName: string, field: Field, ngModel: string[] = [], indexes: string[] = []): string {
    switch (field.frontControl) {
      case FrontControls.ENUM_DROPDOWN:
        fieldName + "Values";
        break;
      default:
        return "";
    }
  }
  getFieldControlHTML(fieldName: string, field: Field, ngModel: string[] = ["entity"], indexes: string[] = []): string {
    // if it's an object, don't need front type, just get all fields
    if (field.type == FieldType.Object) {
      let t = [];
      for (let i in field.properties) {
        t.push(this.getFieldControlHTML(i, field.properties[i], ngModel.slice(), indexes));
      }

      return t.join("\n");
    }

    // otherwise use front control
    const tpl = field.frontControl.toString().toLocaleLowerCase();

    const tplCompiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, "..", "templates", "angular", "controls", `${tpl}.html`), "utf8")
    );

    ngModel.push(fieldName);
    let name = fieldName;
    let id = "id-" + fieldName;
    indexes.forEach(index => {
      name += "_{{" + index + "}}";
      fieldName += "_{{" + index + "}}";
      id += "_{{" + index + "}}";
    });
    let srcModel = null;
    let srcId = null;
    let srcLabel = null;
    let indexName = null;
    let childControls = null;

    switch (field.frontControl) {
      case FrontControls.ARRAY:
        indexName = fieldName + "Id";
        indexes.push(indexName);
        let ngModel2 = ngModel.slice();
        ngModel2.pop();
        ngModel2.push(fieldName + `[${indexName}]`);
        childControls = this.getFieldControlHTML(null, field.items, ngModel2, indexes);
        indexes.pop();
        break;
      case FrontControls.HTTP_DROPDOWN:
        srcModel = field.frontData.srcModel;
        srcId = field.frontData.srcId;
        srcLabel = field.frontData.srcLabel;
        break;
      case FrontControls.ENUM_DROPDOWN:
        srcModel = fieldName + "Values";
        srcId = "id";
        srcLabel = "label";
        break;
      default:
    }

    return tplCompiled({
      label: field.label,
      id: id,
      name: name,
      ngModel: ngModel.join("."),
      safeNgModel: ngModel.join("?."),
      indexName: indexName,
      childControls: childControls,

      srcUrl: null,
      srcModel: srcModel,
      srcId: srcId,
      srcLabel: srcLabel
    });
  }
}
