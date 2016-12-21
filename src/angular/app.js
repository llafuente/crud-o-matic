import angular from 'angular';

<% schemas.forEach(function(schemaName) { %>
import <%= schemaName %>Module from './<%= schemaName %>.module.js'
<% }); %>

angular
.module('CRUD-O-Matic', [<% schemas.forEach(function(schemaName) { %>
  <%= schemaName %>Module,
<% }); %>
]);

export default 'CRUD-O-Matic';
