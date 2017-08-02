import mongoose = require("mongoose");

const pluralize = require("pluralize");

enum PrimiteTypes {
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

export class PrimiteType {
  label: string;
  type: PrimiteTypes;

  items: PrimiteType[];
  properties: { [s: string]: PrimiteType; };

  enum: string[];
  labels: string[];

  default: any;

  constructor(json: any) {

    if (json.type === undefined) {
      console.error(json);
      throw new Error("PrimiteType: type is required");
    }

    if (!(json.type in PrimiteTypes)) {
      console.error(json);
      throw new Error(`PrimiteType[${json.type}]: type is invalid`);
    }

    this.type = json.type;

    if (this.type != PrimiteTypes.Object && json.label === undefined) {
      console.error(json);
      throw new Error("PrimiteType: label is required");
    }


    this.label = json.label;

    if (this.type == PrimiteTypes.Array) {
      this.items = json.items;

      for (let i = 0; i < this.items.length; ++i) {
        this.items[i] = new PrimiteType(this.items[i]);
      }
    } else {
      this.items = null;
    }

    if (this.type == PrimiteTypes.Object) {
      this.properties = json.properties;

      // now cast every property
      for (let i in this.properties) {
        this.properties[i] = new PrimiteType(this.properties[i]);
      }
    } else {
      this.properties = null;
    }

    this.enum = json.enum || null;
    this.labels = json.labels || null;
    this.default = json.default || null;
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
        return PrimiteTypes.Number;
      case PrimiteTypes.Array:
        return "[]";
      default:
        return this.type;
    }
  }
};

export class PermissionsAllowed {
  label: string = null;
  allowed: boolean = false;

  constructor(json: any = null) {
    if (json) {
      this.label = json.label || null;
      this.allowed = json.allowed === true;
    }
  }
}

export class Permissions {
  read: PermissionsAllowed = new PermissionsAllowed();
  list: PermissionsAllowed = new PermissionsAllowed();
  create: PermissionsAllowed = new PermissionsAllowed();
  update: PermissionsAllowed = new PermissionsAllowed();
  delete: PermissionsAllowed = new PermissionsAllowed();

  constructor(json) {
    this.read = new PermissionsAllowed(json.read);
    this.list = new PermissionsAllowed(json.list);
    this.create = new PermissionsAllowed(json.create);
    this.update = new PermissionsAllowed(json.update);
    this.delete = new PermissionsAllowed(json.delete);
  }
};

export class BackEndSchema {
  parentSchema: Schema;
  //TODO mongoose.xxx ?
  options: {
    collection: string
  } = null;

  permissions: Permissions = null;

  schema: { [s: string]: PrimiteType; }  = null;

  createFilename: string;
  createFunction: string;

  readFunction: string;
  readFilename: string;

  listFunction: string;
  listFilename: string;

  updateFunction: string;
  updateFilename: string;

  deleteFunction: string;
  deleteFilename: string;

  routerFilename: string;
  routerName: string;

  constructor(json, parentSchema: Schema) {
    this.parentSchema = parentSchema;

    if (json.permissions === undefined) {
      throw new Error("BackEndSchema: permissions is required");
    }

    if (json.schema === undefined) {
      throw new Error("BackEndSchema: schema is required");
    }

    this.options = json.options || {};
    this.options.collection = this.parentSchema.entityPlural;
    this.permissions = new Permissions(json.permissions);
    this.schema = json.schema;
    // now cast every property
    for (let i in this.schema) {
      this.schema[i] = new PrimiteType(this.schema[i]);
    }

    this.createFunction = `create${this.parentSchema.entitySingularUc}`;
    this.createFilename = `${this.createFunction}.ts`;

    this.readFunction = `read${this.parentSchema.entitySingularUc}`;
    this.readFilename = `${this.readFunction}.ts`;

    this.listFunction = `list${this.parentSchema.entitySingularUc}`;
    this.listFilename = `${this.listFunction}.ts`;

    this.deleteFunction = `destroy${this.parentSchema.entitySingularUc}`;
    this.deleteFilename = `${this.deleteFunction}.ts`;

    this.updateFunction = `update${this.parentSchema.entitySingularUc}`;
    this.updateFilename = `${this.updateFunction}.ts`;

    this.routerFilename = `router${this.parentSchema.entitySingularUc}.ts`;
    this.routerName = `router${this.parentSchema.entitySingularUc}`;
  }
};

export class FrontEndSchema {
  singular: string;

  constructor(json) {

  }
}


export class Schema {
  entitySingular: string;
  entitySingularUc: string;
  entityPlural: string;
  entityId: string;

  interfaceName: string;
  interfaceModel: string;
  schemaName: string;
  modelName: string;

  backend: BackEndSchema;
  frontend: FrontEndSchema;

  constructor(json) {
    if (json.entitySingular === undefined) {
      throw new Error("Schema: entitySingular is required");
    }

    if (json.backend === undefined) {
      throw new Error("Schema: backend is required");
    }

    this.entitySingular = json.entitySingular;
    this.entityPlural = json.entityPlural || pluralize(this.entitySingular);
    this.modelName = this.entitySingularUc = this.entitySingular[0].toLocaleUpperCase() + this.entitySingular.substring(1);

    this.interfaceName = "I" + this.entitySingularUc;
    this.interfaceModel = "I" + this.entitySingularUc + "Model";
    this.entityId = this.entitySingular + "Id";
    this.schemaName = this.entitySingularUc + "Schema";

    this.backend = new BackEndSchema(json.backend, this);
  }
}
