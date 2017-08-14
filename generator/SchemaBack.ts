import { Schema } from "./Schema";
import { ApiAccessPermissions } from "./ApiAccessPermissions";
import mongoose = require("mongoose");

export class SchemaBack {
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

    this.options = json.options || {};
    this.options.collection = this.parentSchema.plural;
    this.apiAccess = ApiAccessPermissions.fromJSON(json.apiAccess || null);

    this.createFunction = `create${this.parentSchema.singularUc}`;
    this.readFunction = `read${this.parentSchema.singularUc}`;
    this.listFunction = `list${this.parentSchema.singularUc}`;
    this.deleteFunction = `destroy${this.parentSchema.singularUc}`;
    this.updateFunction = `update${this.parentSchema.singularUc}`;
    this.routerName = `router${this.parentSchema.singularUc}`;
  }
}
