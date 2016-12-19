/* eslint-disable */
import <%= schema.getName() %>CreateController from './<%= schema.getName() %>.create.controller.js';
import <%= schema.getName() %>UpdateController from './<%= schema.getName() %>.update.controller.js';
import <%= schema.getName() %>ListController from './<%= schema.getName() %>.list.controller.js';
import <%= schema.getName() %>Routes from './<%= schema.getName() %>.routes.config.js';
import angular from 'angular';
import 'angular-smart-table';
import 'checklist-model';
import stDateRange from './st-date-range.js';
import stSelect from './st-select.js';

angular
.module('<%= schema.getName() %>Entity', [
  'smart-table',
  'checklist-model',
  stDateRange,
  stSelect,
])
.config(<%= schema.getName() %>Routes)
.controller('<%= schema.getName() %>CreateController', <%= schema.getName() %>CreateController)
.controller('<%= schema.getName() %>UpdateController', <%= schema.getName() %>UpdateController)
.controller('<%= schema.getName() %>ListController', <%= schema.getName() %>ListController)

<% _.each(schema.getSelects(), function(select) { %>
.value("<%- select.name %>Values", <%- JSON.stringify(select.values) %>)
<% }); %>

;

// export the name
export default '<%= schema.getName() %>Entity';
