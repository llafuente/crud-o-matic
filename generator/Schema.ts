import mongoose = require("mongoose");
import { Generator } from "./Generator";
import * as fs from "fs";
import * as path from "path";
import { FieldType } from "./FieldType";
export * from "./FieldType";
import { FrontControls } from "./FrontControls";
export * from "./FrontControls";
import { FieldPermissions } from "./FieldPermissions";
export * from "./FieldPermissions";
import { Field } from "./Field";
export * from "./Field";
import { PermissionsAllowed } from "./PermissionsAllowed";
export * from "./PermissionsAllowed";
import { ApiAccessPermissions } from "./ApiAccessPermissions";
export * from "./ApiAccessPermissions";
import { SchemaFront } from "./SchemaFront";
export * from "./SchemaFront";
import { SchemaBack } from "./SchemaBack";
export * from "./SchemaBack";

const _ = require("lodash");
const ejs = require("ejs");
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

  baseApiUrl: string = "";
  domain: string = "";

  fields: { [s: string]: Field } = null;

  constructor(public singular: string, public generator: Generator) {
    this._ = _;
    this.plural = pluralize(this.singular);
    this.init();

    this.backend = new SchemaBack({}, this);
    this.frontend = new SchemaFront({}, this);
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
      schema.addField(i, schema.fields[i]);
    }

    return schema;
  }

  addField(key: string, field: Field) {
    this.fields = this.fields || {};
    this.fields[key] = field;
  }

  forEachBackEndField(cb) {
    for (const key in this.fields) {
      if (this.fields[key].type !== FieldType.Hidden) {
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

  forEachField(cb) {
    // TODO
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
