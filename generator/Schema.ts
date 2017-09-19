import { Generator } from "./Generator";
import { FieldType } from "./FieldType";
export * from "./FieldType";
import { FrontControls } from "./FrontControls";
export * from "./FrontControls";
export * from "./FieldPermissions";
import { Field, IFieldCallback } from "./Field";
export * from "./Field";
export * from "./PermissionsAllowed";
export * from "./ApiAccessPermissions";
import { SchemaFront } from "./SchemaFront";
export * from "./SchemaFront";
import { SchemaBack } from "./SchemaBack";
export * from "./SchemaBack";

const _ = require("lodash");
const pluralize = require("pluralize");

export class Schema {
  singularUc: string;
  plural: string;
  entityId: string;

  interfaceName: string;
  interfaceModel: string;
  typeName: string;
  schemaName: string;
  modelName: string;

  backend: SchemaBack;
  frontend: SchemaFront;

  module: string;
  moduleFile: string;

  root: Field;

  constructor(public singular: string, public generator: Generator) {
    this._ = _;
    this.plural = pluralize(this.singular);
    this.init();

    this.backend = new SchemaBack({}, this);
    this.frontend = new SchemaFront({}, this);
    this.root = new Field("entity", FieldType.Object);
    this.root.name = "entity";
  }

  private init() {
    this.modelName = this.singularUc = this.singular[0].toLocaleUpperCase() + this.singular.substring(1);
    this.interfaceName = "I" + this.singularUc;
    this.interfaceModel = "I" + this.singularUc + "Model";
    this.typeName = this.singularUc + "Type";
    this.entityId = this.singular + "Id";
    this.schemaName = this.singularUc + "Schema";

    this.module = this.plural[0].toLocaleUpperCase() + this.plural.substring(1) + "Module";
    this.moduleFile = this.plural[0].toLocaleUpperCase() + this.plural.substring(1) + ".module";
  }
  /*
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
    schema.init();

    schema.backend = new SchemaBack(json.backend, schema);
    schema.frontend = new SchemaFront(json.frontend || {}, schema);

    // now cast every property
    for (const i in json.fields) {
      schema.addField(i, json[i]);
    }

    return schema;
  }
*/
  addField(fieldName: string, field: Field) {
    this.root.addProperty(fieldName, field);
    field.each((fname, f) => {
      f.attach(this);
    });
  }

  forEachBackEndField(cb: IFieldCallback, recursive: boolean = false) {
    this.root.each((fieldName, field) => {
      if (field.type !== FieldType.Hidden) {
        cb(fieldName, field);
      }
    }, recursive);
  }

  // TODO sublevel blacklist
  getBackEndBlacklist(action: string /*TODO PermissionKeys*/): string[] {
    const ret = [];
    this.root.each((fieldName, field) => {
      if (!field.permissions[action]) {
        ret.push(fieldName);
      }
    });

    return ret;
  }

  eachField(cb: IFieldCallback) {
    this.root.each(cb, true);
  }

  forEachFrontEndField(cb: IFieldCallback) {
    this.root.each((fieldName, field) => {
      if (field.frontControl !== FrontControls.Hidden) {
        cb(fieldName, field);
      }
    });
  }

  // helper for templates
  _: any; // lodash
  ucFirst = function(str): string {
    return str[0].toLocaleUpperCase() + str.substring(1);
  };

  url(action: string, fullUrl: boolean = false) {
    let domain = "";
    if (fullUrl) {
      domain = "\${this.domain}";
    }

    switch (action) {
      case "IMPORT":
        return `${domain}${this.generator.baseApiUrl}/${this.plural}/csv`;
      case "LIST":
      case "CREATE":
        return `${domain}${this.generator.baseApiUrl}/${this.plural}`;
      case "READ":
      case "DELETE":
      case "UPDATE":
        return `${domain}${this.generator.baseApiUrl}/${this.plural}/:${this.entityId}`;
    }

    throw new Error(`invalid action: ${action}`);
  }
}
