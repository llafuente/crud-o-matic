import * as mongoose from 'mongoose';


export interface <%= interfaceName %> {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  <% forEachBackEndField((key, PrimiteType) => { %>
    <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
  <% }) %>

  <% if (interfaceName == "IUser") { %>
    authenticate(password: string);
  <% } %>
};


export class <%= typeName %> implements <%= interfaceName %> {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  <% forEachBackEndField((key, PrimiteType) => { %>
  <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
  <% }) %>
  constructor() {}

  static fromJSON(obj: <%= interfaceName %>|any): <%= typeName %> {
    const r = new <%= typeName %>();
  <% forEachBackEndField((key, PrimiteType) => { %>
    r.<%= key %> = obj.<%= key %>;
  <% }) %>
    return r;
  }

  <% if (interfaceName == "IUser") { %>
    authenticate(password: string) {}
  <% } %>
};
