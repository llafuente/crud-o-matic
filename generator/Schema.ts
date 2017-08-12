import mongoose = require("mongoose");
import { Generator } from "./Generator";
import * as fs from "fs";
import * as path from "path";

const _ = require("lodash");
const ejs = require("ejs");
const pluralize = require("pluralize");

export enum PrimiteTypes {
  Hidden = "Hidden",
  Object = "Object",
  Array = "Array",
  Date = "Date",
  String = "String",
  Boolean = "Boolean",
  Number = "Number",
  Mixed = "Mixed",
  ObjectId = "ObjectId",
  AutoPrimaryKey = "AutoPrimaryKey",
}

export enum FrontControls {
  Hidden = "Hidden",
  TEXT = "STRING",
  EMAIL = "EMAIL",
  BIGTEXT = "TEXT",
  PASSWORD = "PASSWORD",
  DROPDOWN = "DROPDOWN",
  ENUM_DROPDOWN = "ENUM_DROPDOWN",
  HTTP_DROPDOWN = "HTTP_DROPDOWN",
  TEXTAREA = "TEXTAREA",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
}

export class FieldPermissions {
  constructor(
    public read: boolean = true,
    public list: boolean = true,
    public create: boolean = true,
    public update: boolean = true,
  ) {}

  static fromJSON(json): FieldPermissions {
    if (json) {
      return new FieldPermissions(json.read === true, json.list === true, json.create === true, json.update === true);
    }

    return new FieldPermissions();
  }
}

export class PrimiteType {
  label: string;
  type: PrimiteTypes;
  frontControl: FrontControls;

  items: PrimiteType = null;
  properties: { [s: string]: PrimiteType } = null;

  defaults: any = null;
  enums: string[] = null;
  labels: string[] = null;
  unique: boolean = false;
  editable: boolean = false;

  // constrains
  required: boolean = false;
  maxlength: number = null; // for strings
  minlength: number = null; // for strings
  min: number = null; // for numbers
  max: number = null; // for numbers

  // transforms
  lowercase: boolean = false;
  uppercase: boolean = false;

  permissions: FieldPermissions = new FieldPermissions();
  refTo: string;

  constructor(label: string, type: PrimiteTypes, frontControl: FrontControls) {
    this.label = label;
    this.type = type;
    this.frontControl = frontControl;
  }

  static fromJSON(json: PrimiteType): PrimiteType {
    if (json.type === undefined) {
      console.error(json);
      throw new Error("PrimiteType: type is required");
    }

    if (!(json.type in PrimiteTypes)) {
      console.error(json);
      throw new Error(`PrimiteType[${json.type}]: type is invalid`);
    }

    if (json.type != PrimiteTypes.Object && json.label === undefined) {
      console.error(json);
      throw new Error("PrimiteType: label is required");
    }

    return new PrimiteType(json.label, json.type, json.frontControl || FrontControls.TEXT)
      .setPermissions(json.permissions || null)
      .setItems(json.items || null)
      .addProperties(json.properties || null)
      .setEnumConstraint(json.enums || null, json.labels || null)
      .setDefault(json.defaults || null)
      .setUnique(json.unique === true)
      .setRequired(json.required || false)
      .setMaxlength(json.maxlength || null)
      .setMinlength(json.minlength || null)
      .setMin(json.min || null)
      .setMax(json.max || null)
      .setLowercase(json.lowercase || false)
      .setUppercase(json.uppercase || false);
  }

  setItems(items: PrimiteType): PrimiteType {
    if (this.type == PrimiteTypes.Array && items) {
      this.items = PrimiteType.fromJSON(items);
    } else {
      this.items = null;
    }

    return this;
  }

  addProperties(properties: { [s: string]: PrimiteType }): PrimiteType {
    if (this.type == PrimiteTypes.Object && properties) {
      // now cast every property
      this.properties = {};
      for (const i in properties) {
        this.properties[i] = PrimiteType.fromJSON(properties[i]);
      }
    } else {
      this.properties = null;
    }

    return this;
  }

  setEnumConstraint(enums: string[], labels: string[]): PrimiteType {
    this.enums = enums;
    this.labels = labels;

    return this;
  }

  setDefault(defaults: any): PrimiteType {
    this.defaults = defaults;

    return this;
  }

  setUnique(unqiue: boolean): PrimiteType {
    this.unique = unqiue;

    return this;
  }

  setEditable(editable: boolean): PrimiteType {
    this.editable = editable;

    return this;
  }

  setPermissions(perms: FieldPermissions): PrimiteType {
    this.permissions = FieldPermissions.fromJSON(perms);

    return this;
  }

  setRefTo(refTo: string): PrimiteType {
    this.refTo = refTo;

    return this;
  }

  setRequired(required: boolean): PrimiteType {
    this.required = required;

    return this;
  }

  setMaxlength(maxlength: number): PrimiteType {
    this.maxlength = maxlength;

    return this;
  }

  setMinlength(minlength: number): PrimiteType {
    this.minlength = minlength;

    return this;
  }

  setMin(min: number): PrimiteType {
    this.min = min;

    return this;
  }

  setMax(max: number): PrimiteType {
    this.max = max;

    return this;
  }

  setLowercase(lowercase: boolean): PrimiteType {
    this.lowercase = lowercase;

    return this;
  }

  setUppercase(uppercase: boolean): PrimiteType {
    this.uppercase = uppercase;

    return this;
  }

  getTypeScriptType() {
    switch (this.type) {
      case PrimiteTypes.AutoPrimaryKey:
        return PrimiteTypes.Number;
      case PrimiteTypes.Array:
        return "any[]";
      default:
        return this.type;
    }
  }

  getMongooseType() {
    const d = [];

    switch (this.type) {
      case PrimiteTypes.AutoPrimaryKey:
        d.push(`type: ${PrimiteTypes.Number}`);
        break;
      case PrimiteTypes.Array:
        d.push(`type: Array`);
        d.push(`items: ${this.items.getMongooseType()}`);
        break;
      default:
        d.push(`type: ${this.type}`);
    }

    // common
    if (this.unique) {
      d.push(`unique: ${this.unique}`);
    }

    if (this.defaults) {
      d.push(`default: ${JSON.stringify(this.defaults)}`);
    }

    if (this.refTo) {
      d.push(`ref: ${this.refTo}`);
    }

    if (this.enums) {
      d.push(`enum: ${JSON.stringify(this.enums)}`);
    }

    if (this.required !== false) {
      d.push(`required: ${this.required}`);
    }
    if (this.maxlength !== null) {
      d.push(`maxlength: ${this.maxlength}`);
    }
    if (this.minlength !== null) {
      d.push(`minlength: ${this.minlength}`);
    }
    if (this.min !== null) {
      d.push(`min: ${this.min}`);
    }
    if (this.max !== null) {
      d.push(`max: ${this.max}`);
    }
    if (this.lowercase !== false) {
      d.push(`lowercase: ${this.lowercase}`);
    }
    if (this.uppercase !== false) {
      d.push(`uppercase: ${this.uppercase}`);
    }

    return "{\n" + d.join(",\n") + "\n}";
  }
}

export class PermissionsAllowed {
  constructor(public label: string = null, public allowed: boolean = false) {}

  static fromJSON(json: any = null): PermissionsAllowed {
    if (json) {
      return new PermissionsAllowed(json.label || null, json.allowed === true);
    }
    return new PermissionsAllowed(); // defaults
  }
}

export class ApiAccessPermissions {
  read: PermissionsAllowed = new PermissionsAllowed();
  list: PermissionsAllowed = new PermissionsAllowed();
  create: PermissionsAllowed = new PermissionsAllowed();
  update: PermissionsAllowed = new PermissionsAllowed();
  delete: PermissionsAllowed = new PermissionsAllowed();

  constructor(
    read: PermissionsAllowed,
    list: PermissionsAllowed,
    create: PermissionsAllowed,
    update: PermissionsAllowed,
    _delete: PermissionsAllowed,
  ) {
    this.read = read;
    this.list = list;
    this.create = create;
    this.update = update;
    this.delete = _delete;
  }

  static fromJSON(json): ApiAccessPermissions {
    return new ApiAccessPermissions(
      PermissionsAllowed.fromJSON(json.read),
      PermissionsAllowed.fromJSON(json.list),
      PermissionsAllowed.fromJSON(json.create),
      PermissionsAllowed.fromJSON(json.update),
      PermissionsAllowed.fromJSON(json.delete),
    );
  }
}

export class BackEndSchema {
  parentSchema: Schema;

  options?: mongoose.SchemaOptions = null;

  apiAccess: ApiAccessPermissions = null;

  createFunction: string;
  readFunction: string;
  listFunction: string;
  updateFunction: string;
  deleteFunction: string;
  routerName: string;

  constructor(json, parentSchema: Schema) {
    this.parentSchema = parentSchema;

    // TODO use default, allow all
    if (json.apiAccess === undefined) {
      throw new Error("BackEndSchema: apiAccess is required");
    }

    this.options = json.options || {};
    this.options.collection = this.parentSchema.plural;
    this.apiAccess = ApiAccessPermissions.fromJSON(json.apiAccess);

    this.createFunction = `create${this.parentSchema.singularUc}`;
    this.readFunction = `read${this.parentSchema.singularUc}`;
    this.listFunction = `list${this.parentSchema.singularUc}`;
    this.deleteFunction = `destroy${this.parentSchema.singularUc}`;
    this.updateFunction = `update${this.parentSchema.singularUc}`;
    this.routerName = `router${this.parentSchema.singularUc}`;
  }
}

export class FrontEndSchema {
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
      controls.push(
        this.getFieldControlHTML(fieldName, this.parentSchema.fields[fieldName])
      );
    }

    return controls.join("\n");
  }

  getCreateDeclarations(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      const field = this.parentSchema.fields[fieldName];
      switch(field.frontControl) {
        case FrontControls.ENUM_DROPDOWN:
          const values = field.enums.map((id, idx) => {
            return {id: id, label: field.labels[idx]};
          });

          controls.push(fieldName + "Values: {id: string, label: string}[] = " + JSON.stringify(values));
          break;
        default:
      }
    }

    return controls.join("\n");
  }

  getCreateControlsTS(): string {
    const controls = [];
    for (let fieldName in this.parentSchema.fields) {
      controls.push(
        this.getFieldControlTS(fieldName, this.parentSchema.fields[fieldName])
      );
    }

    return controls.join("\n");
  }

  getFieldControlTS(fieldName:string, field: PrimiteType, ngModel: string[] = [], indexes: string[] = []): string {
    switch(field.frontControl) {
      case FrontControls.ENUM_DROPDOWN:

        fieldName + "Values"
        break;
      default:
      return '';
    }
  }
  getFieldControlHTML(fieldName:string, field: PrimiteType, ngModel: string[] = ["entity"], indexes: string[] = []): string {
    const tpl = field.frontControl.toString().toLocaleLowerCase();

    const tplCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "..", "templates", "angular", "controls", `${tpl}.html`), 'utf8'));

    ngModel.push(fieldName);
    let name = fieldName;
    let id = "id-" + fieldName;
    indexes.forEach((index) => {
      name += "-{{" + index + "}}"
      fieldName += "-{{" + index + "}}"
    });
    let srcModel = null;
    let srcId = null;
    let srcLabel = null;

    switch(field.frontControl) {
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
      indexName: null,
      childControls: null,

      srcUrl: null,
      srcModel: srcModel,
      srcId: srcId,
      srcLabel: srcLabel,
    });
  }
}

export class Schema {
  singularUc: string;
  plural: string;
  entityId: string;

  interfaceName: string;
  interfaceModel: string;
  typeName: string;
  schemaName: string;
  modelName: string;

  backend: BackEndSchema;
  frontend: FrontEndSchema;

  module: string;
  moduleFile: string;

  baseApiUrl: string = "";
  domain: string = "";

  fields: { [s: string]: PrimiteType } = null;

  constructor(
    public singular: string,
    public generator: Generator,
  ) {
    this._ = _;
  }

  static fromJSON(json: any, generator: Generator): Schema {
    if (json.singular === undefined) {
      throw new Error("Schema: singular is required");
    }

    if (json.backend === undefined) {
      throw new Error("Schema: backend is required");
    }

    const schema = new Schema(json.singular, generator);

    schema.singular = json.singular;
    schema.plural = json.plural || pluralize(schema.singular);

    schema.modelName = schema.singularUc = schema.singular[0].toLocaleUpperCase() + schema.singular.substring(1);
    schema.interfaceName = "I" + schema.singularUc;
    schema.interfaceModel = "I" + schema.singularUc + "Model";
    schema.typeName = schema.singularUc + "Type";
    schema.entityId = schema.singular + "Id";
    schema.schemaName = schema.singularUc + "Schema";

    schema.module = schema.plural[0].toLocaleUpperCase() + schema.plural.substring(1) + "Module";
    schema.moduleFile = schema.plural[0].toLocaleUpperCase() + schema.plural.substring(1) + ".module";

    schema.backend = new BackEndSchema(json.backend, schema);
    schema.frontend = new FrontEndSchema(json.frontend || {}, schema);

    // now cast every property
    for (const i in json.fields) {
      schema.addField(i, schema.fields[i]);
    }

    return schema;
  }

  addField(key: string, field: PrimiteType) {
    this.fields = this.fields || {};
    this.fields[key] = PrimiteType.fromJSON(field);
  }

  forEachBackEndField(cb) {
    for (const key in this.fields) {
      if (this.fields[key].type !== PrimiteTypes.Hidden) {
        cb(key, this.fields[key]);
      }
    }
  }

  // TODO sublevel blacklist
  getBackEndBlacklist(action: string /*TODO PermissionKeys*/): string[] {
    const ret = [];
    for (const key in this.fields) {
      if (!this.fields[key].permissions[action]) {
        ret.push(key);
      }
    }

    return ret;
  }

  forEachFrontEndField(cb) {
    for (const key in this.fields) {
      if (this.fields[key].frontControl !== FrontControls.Hidden) {
        cb(key, this.fields[key]);
      }
    }
  }

  // helper for templates
  _: any; // lodash
  ucFirst = function(str): string {
    return str[0].toLocaleUpperCase() + str.substring(1);
  };

  url(action: string, fullUrl: boolean = false) {
    let domain = "";
    if (fullUrl) {
      domain = this.domain;
    }

    switch (action) {
      case "LIST":
      case "CREATE":
        return `${domain}${this.baseApiUrl}/${this.plural}`;
      case "READ":
      case "DELETE":
      case "UPDATE":
        return `${domain}${this.baseApiUrl}/${this.plural}/:${this.entityId}`;
    }

    throw new Error(`invalid action: ${action}`);
  }
}
