import * as mongoose from 'mongoose';


export interface <%= interfaceName %> {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  <% _.each(backend.schema, (PrimiteType, key) => { %>
    <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
  <% }) %>
};


export class <%= typeName %> implements <%= interfaceName %> {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  <% _.each(backend.schema, (PrimiteType, key) => { %>
  <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
  <% }) %>
  constructor() {}

  static fromJSON(obj: <%= interfaceName %>|any): <%= typeName %> {
    const r = new <%= typeName %>();
  <% _.each(backend.schema, (PrimiteType, key) => { %>
    r.<%= key %> = obj.<%= key %>;
  <% }) %>
    return r;
  }
};
