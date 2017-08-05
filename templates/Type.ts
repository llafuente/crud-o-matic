export interface <%= interfaceName %> {
  <% _.each(backend.schema, (PrimiteType, key) => { %>
    <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
  <% }) %>
};


export class <%= typeName %> implements <%= interfaceName %> {
  <% _.each(backend.schema, (PrimiteType, key) => { %>
  public <%= key %>: <%= PrimiteType.getTypeScriptType() %>;
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
