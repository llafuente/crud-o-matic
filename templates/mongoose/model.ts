import mongoose = require("mongoose");

import { <%= interfaceName %> } from './<%= interfaceName %>';
export * from './<%= interfaceName %>';

export interface <%= interfaceName %>Model extends <%= interfaceName %>, mongoose.Document { }

export const <%= schemaName %> = new mongoose.Schema({
  <% _.each(backend.schema, function(PrimiteType, key) { %>
    <%= key %>: <%= PrimiteType.getMongooseType() %>,
  <% }) %>
}, <%= JSON.stringify(backend.options, null, 2) %>);

export const <%= singularUc %> = mongoose.model<<%= interfaceName %>Model>("User", <%= schemaName %>);