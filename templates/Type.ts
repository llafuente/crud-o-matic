import * as mongoose from 'mongoose';


export interface <%= interfaceName %> {
  _id: string|any;
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  <%- root.getTypeScriptType(false) %>;

  <% if (interfaceName == "IUser") { %>
    authenticate(password: string);
  <% } %>
};


export class <%= typeName %> implements <%= interfaceName %> {
  _id: string|any = null;
  id?: string = null;
  createdAt: Date = null;
  updatedAt: Date = null;

  <%- root.getTypeScriptType(true) %>;
  constructor() {}

  static fromJSON(obj: <%= interfaceName %>|any): <%= typeName %> {
    const r = new <%= typeName %>();
<%
    forEachBackEndField((fieldName, field) => {
      if (field.parentField != null) {
%>
    r.<%= fieldName %> = obj.<%= fieldName %>;
<%
      }
    }, false)
%>
    return r;
  }

  <% if (interfaceName == "IUser") { %>
    authenticate(password: string) {}
  <% } %>
};
