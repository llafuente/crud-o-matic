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
  constructor(
    public label: string,
    public type: PrimiteTypes,

    public items: PrimiteType[],
    public properties: { [s: string]: PrimiteType; },

    public enums: string[],
    public labels: string[],

    public defaults: any,
  ) {

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


    if (json.type == PrimiteTypes.Array) {
      for (let i = 0; i < json.items.length; ++i) {
        json.items[i] = PrimiteType.fromJSON(json.items[i]);
      }
    } else {
      json.items = null;
    }

    if (json.type == PrimiteTypes.Object) {
      // now cast every property
      for (let i in json.properties) {
        json.properties[i] = PrimiteType.fromJSON(json.properties[i]);
      }
    } else {
      json.properties = null;
    }

    return new PrimiteType(
      json.label,
      json.type,
      json.items,
      json.properties,
      json.enums || null,
      json.labels || null,
      json.defaults || null,
    );
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

export class Permissions {
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

  static fromJSON(json): Permissions {
    return new Permissions(
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
  //TODO mongoose.xxx ?
  options: {
    collection: string
  } = null;

  permissions: Permissions = null;

  schema: { [s: string]: PrimiteType; }  = null;

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
    this.permissions = Permissions.fromJSON(json.permissions);
    this.schema = json.schema;
    // now cast every property
    for (let i in this.schema) {
      this.schema[i] = PrimiteType.fromJSON(this.schema[i]);
    }
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

    this.createFunction = `create${this.entitySingularUc}`;
    this.createFilename = `${this.createFunction}.ts`;

    this.readFunction = `read${this.entitySingularUc}`;
    this.readFilename = `${this.readFunction}.ts`;

    this.listFunction = `list${this.entitySingularUc}`;
    this.listFilename = `${this.listFunction}.ts`;

    this.deleteFunction = `destroy${this.entitySingularUc}`;
    this.deleteFilename = `${this.deleteFunction}.ts`;

    this.updateFunction = `update${this.entitySingularUc}`;
    this.updateFilename = `${this.updateFunction}.ts`;

    this.routerName = `router${this.entitySingularUc}`;
    this.routerFilename = `${this.routerName}.ts`;

    this.backend = new BackEndSchema(json.backend, this);
  }
}
