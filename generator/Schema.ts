import mongoose = require("mongoose");
import { Generator } from './Generator';

const _ = require('lodash');
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
};

export enum FrontControls {
  Hidden = "Hidden",
  TEXT = "TEXT",
  PASSWORD = "PASSWORD",
  DROPDOWN = "DROPDOWN",
  TEXTAREA = "TEXTAREA",
  CHECKBOX = "CHECKBOX",
};

export class FieldPermissions {
  constructor(
    public read: boolean = true,
    public list: boolean = true,
    public create: boolean = true,
    public update: boolean = true,
  ) {

  }

  static fromJSON(json): FieldPermissions {
    return new FieldPermissions(
      json.read === true,
      json.list === true,
      json.create === true,
      json.update === true,
    );
  }
};

export class PrimiteType {
  label: string;
  type: PrimiteTypes;
  frontControl: FrontControls;

  items: PrimiteType[] = null;
  properties: { [s: string]: PrimiteType; } = null;

  defaults: any = null;
  enums: string[] = null;
  labels: string[] = null;
  unique: boolean = false;
  editable: boolean = false;

  permissions: FieldPermissions = new FieldPermissions();

  constructor(
    label: string,
    type: PrimiteTypes,
    frontControl: FrontControls,
  ) {
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

    return new PrimiteType(
      json.label,
      json.type,
      json.frontControl || FrontControls.TEXT,
    )
    .additems(json.items || null)
    .addProperties(json.properties || null)
    .addConstraintEnum(json.enums || null, json.labels || null)
    .setDefault(json.defaults || null)
    .setUnique(json.unique === true);
  }

  additems(items: PrimiteType[]): PrimiteType {
    if (this.type == PrimiteTypes.Array && items) {
      this.items = [];
      for (let i = 0; i < items.length; ++i) {
        this.items[i] = PrimiteType.fromJSON(items[i]);
      }
    } else {
      this.items = null;
    }

    return this;
  }

  addProperties(properties: { [s: string]: PrimiteType; }): PrimiteType {
    if (this.type == PrimiteTypes.Object && properties) {
      // now cast every property
      this.properties = {};
      for (let i in properties) {
        this.properties[i] = PrimiteType.fromJSON(properties[i]);
      }
    } else {
      this.properties = null;
    }

    return this;
  }

  addConstraintEnum(enums: string[], labels: string[]): PrimiteType {
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

  setPermissions(perms: FieldPermissions): PrimiteType  {
    this.permissions = FieldPermissions.fromJSON(perms);

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
    switch (this.type) {
      case PrimiteTypes.AutoPrimaryKey:
        return `{
          type: ${PrimiteTypes.Number},
          unique: ${this.unique},
          default: ${this.defaults}
        }`;
      case PrimiteTypes.Array:
        return `[]`;
      default:
        return `{
          type: ${this.type},
          unique: ${this.unique},
          default: ${this.defaults}
        }`;
    }
  }
};

export class PermissionsAllowed {
  constructor(
    public label: string = null,
    public allowed: boolean = false,
  ) {

  }

  static fromJSON(json: any = null): PermissionsAllowed {
    if (json) {
      return new PermissionsAllowed(
        json.label || null,
        json.allowed === true,
      );
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
};

export class BackEndSchema {
  parentSchema: Schema;

  options?: mongoose.SchemaOptions = null;

  apiAccess: ApiAccessPermissions = null;

  schema: { [s: string]: PrimiteType; }  = null;

  createFunction: string;
  readFunction: string;
  listFunction: string;
  updateFunction: string;
  deleteFunction: string;
  routerName: string;

  constructor(json, parentSchema: Schema) {
    this.parentSchema = parentSchema;

    if (json.apiAccess === undefined) {
      throw new Error("BackEndSchema: permissions is required");
    }

    if (json.schema === undefined) {
      throw new Error("BackEndSchema: schema is required");
    }

    this.options = json.options || {};
    this.options.collection = this.parentSchema.plural;
    this.apiAccess = ApiAccessPermissions.fromJSON(json.apiAccess);
    this.schema = json.schema;
    // now cast every property
    for (let i in this.schema) {
      console.log(this.schema[i]);
      this.schema[i] = PrimiteType.fromJSON(this.schema[i]);
    }

    this.createFunction = `create${this.parentSchema.singularUc}`;
    this.readFunction = `read${this.parentSchema.singularUc}`;
    this.listFunction = `list${this.parentSchema.singularUc}`;
    this.deleteFunction = `destroy${this.parentSchema.singularUc}`;
    this.updateFunction = `update${this.parentSchema.singularUc}`;
    this.routerName = `router${this.parentSchema.singularUc}`;
  }

  forEachBackField(cb) {
    for (let key in this.schema) {
      if (this.schema[key].type !== PrimiteTypes.Hidden) {
        cb(key, this.schema[key]);
      }
    }
  }

  forEachFrontField(cb) {
    for (let key in this.schema) {
      if (this.schema[key].frontControl !== FrontControls.Hidden) {
        cb(key, this.schema[key]);
      }
    }
  }
};

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
}


export class Schema {
  singular: string;
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

  constructor(
    public generator: Generator
  ) {
    this._ = _;
  }

  static fromJSON(json: any, generator: Generator): Schema {
    const schema = new Schema(generator);
    if (json.singular === undefined) {
      throw new Error("Schema: singular is required");
    }

    if (json.backend === undefined) {
      throw new Error("Schema: backend is required");
    }

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

    return schema;
  }

  // helper for templates
  _:any; // lodash
  ucFirst = function(str): string {
    return str[0].toLocaleUpperCase() + str.substring(1);
  }

  url(action:string, fullUrl: boolean = false) {
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
