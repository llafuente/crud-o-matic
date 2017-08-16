import { Schema } from "./Schema";
import { FrontControls } from "./FrontControls";
import { Field } from "./Field";
import { FieldType } from "./FieldType";
import { AngularComponent } from "./AngularComponent";
import * as fs from "fs";
import * as path from "path";

const ejs = require("ejs");

const createMethodsHTML = fs.readFileSync(path.join(__dirname, "../templates/angular/src/create.methods.ts"), "utf8")
const updateMethodsHTML = fs.readFileSync(path.join(__dirname, "../templates/angular/src/update.methods.ts"), "utf8")
const createMethods = ejs.compile(createMethodsHTML);
const updateMethods = ejs.compile(updateMethodsHTML);


export class SchemaFront {
  parentSchema: Schema;

  createComponent: string;
  createComponentFile: string;
  listComponent: string;
  listComponentFile: string;
  updateComponent: string;
  updateComponentFile: string;

  listHeader: string;
  createHeader: string;
  updateHeader: string;


  constructor(json, parentSchema: Schema) {
    this.parentSchema = parentSchema;

    this.createComponent = `Create${this.parentSchema.singularUc}Component`;
    this.createComponentFile = `Create${this.parentSchema.singularUc}.component`;
    this.listComponent = `List${this.parentSchema.singularUc}Component`;
    this.listComponentFile = `List${this.parentSchema.singularUc}.component`;
    this.updateComponent = `Update${this.parentSchema.singularUc}Component`;
    this.updateComponentFile = `Update${this.parentSchema.singularUc}.component`;
  }

  saveCreateComponent(destinationPath: string) {
    const comp = new AngularComponent(
      this.createComponent,
      this.parentSchema
    );

    const decl = this.getCreateDeclarations();
    comp.selector = `create-${this.parentSchema.plural}-component`;
    comp.declarations = decl.join(";\n") + ";";
    comp.template = `
<bb-section>
  <bb-section-header>${this.createHeader}</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    ${this.getCreateControlsHTML()}
      <bb-button [routerLink]="['..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>
    `;

    comp.initialization = this.getCreateInitialization().join("\n");
    comp.methods = createMethods(this.parentSchema);

    comp.save(path.join(destinationPath, `${this.createComponentFile}.ts`));
  }

  saveUpdateComponent(destinationPath: string) {
    const comp = new AngularComponent(
      this.updateComponent,
      this.parentSchema
    );

    const decl = this.getCreateDeclarations();
    comp.selector = `update-${this.parentSchema.plural}-component`;
    comp.declarations = decl.join(";\n") + ";";
    comp.template = `
<bb-section>
  <bb-section-header>${this.updateComponent}</bb-section-header>
  <bb-section-content>
    <div>
    <form #f="ngForm" novalidate>
    ${this.getCreateControlsHTML()}
      <bb-button [routerLink]="['../..', 'list']">Cancelar</bb-button>
      <bb-button (click)="save()">Guardar</bb-button>
    </form>
    <!-- <pre>entity: {{entity | json}}</pre> -->
    </div>
  </bb-section-content>
</bb-section>
    `;

    comp.initialization = this.getUpdateInitialization().join("\n");
    comp.methods = updateMethods(this.parentSchema);

    comp.save(path.join(destinationPath, `${this.updateComponentFile}.ts`));
  }

  getCreateControlsHTML(): string {
    const controls = [];
    this.parentSchema.forEachFrontEndField((fieldName, field) => {
      controls.push(this.getFieldControlHTML(fieldName, field));
    });

    return controls.join("\n");
  }

  getCreateDeclarations(): string[] {
    const controls = [];
    this.parentSchema.forEachFrontEndField((fieldName, field) => {
      switch (field.frontControl) {
        case FrontControls.HTTP_DROPDOWN:
          controls.push(field.frontData.declaration + ": any");
          break;
        case FrontControls.ENUM_DROPDOWN:
          const values = field.enums.map((id, idx) => {
            return { id: id, label: field.labels[idx] };
          });

          controls.push(fieldName + "Values: {id: string, label: string}[] = " + JSON.stringify(values));
          break;
        default:
      }
    });

    return controls;
  }

  getCreateImports(): string {
    let imports = [];
    this.parentSchema.forEachFrontEndField((fieldName, field) => {
      imports = imports.concat(field.getCreateImports());
    });
    console.log(imports);
    return imports.join("\n");
  }

  getCreateInitialization(): string[] {
    const controls = [];
    this.parentSchema.forEachFrontEndField((fieldName, field) => {
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
    });

    return controls;
  }

  getUpdateInitialization(): string[] {

    return [`
    //this.id = parseInt(this.getRouteParameter(${JSON.stringify(this.parentSchema.entityId)}), 10);
    this.id = this.getRouteParameter(${JSON.stringify(this.parentSchema.entityId)});

    console.log("--> GET: ${this.parentSchema.url("READ", true)}", this.id);
    this.http.get(${JSON.stringify(this.parentSchema.url("READ", true))}.replace(${JSON.stringify(":" + this.parentSchema.entityId)}, this.id))
    .subscribe((response: ${this.parentSchema.typeName}) => {
      console.log("<-- GET: ${this.parentSchema.url("READ", true)}", response);

      this.entity = response;
    }, (errorResponse: Response) => {
      console.log("<-- POST Error: ${this.parentSchema.url("READ", true)}", errorResponse);
    });
    `].concat(this.getCreateInitialization());
  }

  getCreateControlsTS(): string {
    const controls = [];
    this.parentSchema.forEachFrontEndField((fieldName, field) => {
      controls.push(this.getFieldControlTS(fieldName, field));
    });

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
  getFieldControlHTML(fieldName: string, field: Field, indexes: string[] = []): string {
    // if it's an object, don't need front type, just get all fields
    if (field.type == FieldType.Object) {
      let t = [];
      for (let i in field.properties) {
        t.push(this.getFieldControlHTML(i, field.properties[i], indexes));
      }

      return t.join("\n");
    }

    // otherwise use front control
    const tpl = field.frontControl.toString().toLocaleLowerCase();

    const tplCompiled = ejs.compile(
      fs.readFileSync(path.join(__dirname, "..", "templates", "angular", "controls", `${tpl}.html`), "utf8")
    );

    let modelName = fieldName;
    let name = fieldName;
    let id = "id-" + fieldName;
    indexes.forEach(index => {
      name += "_{{" + index + "}}";
      //fieldName += "_{{" + index + "}}";
      id += "_{{" + index + "}}";
    });
    let srcModel = null;
    let srcId = null;
    let srcLabel = null;
    let indexName = null;
    let childControls = null;

    switch (field.frontControl) {
      case FrontControls.ARRAY:
        indexName = field.getIndexName();
        indexes.push(indexName);
        childControls = this.getFieldControlHTML(null, field.items, indexes);
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
    const ngModel = field.getPath();

    return tplCompiled({
      field: field,
      id: id,
      name: name,
      ngModel: ngModel.join("."),
      modelName: modelName,
      safeNgModel: ngModel.join("?."),
      indexName: indexName,
      childControls: childControls,
      indexes: indexes,

      srcUrl: null,
      srcModel: srcModel,
      srcId: srcId,
      srcLabel: srcLabel
    });
  }
}
