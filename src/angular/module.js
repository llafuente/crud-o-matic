import <%= schema.getName() %>CreateController from './<%= schema.getName() %>.create.controller.js';
import <%= schema.getName() %>UpdateController from './<%= schema.getName() %>.update.controller.js';
import <%= schema.getName() %>ListController from './<%= schema.getName() %>.list.controller.js';
import <%= schema.getName() %>Routes from './<%= schema.getName() %>.routes.config.js';
import angular from 'angular';

angular
.module('<%= schema.getName() %>Entity', [])
.config(<%= schema.getName() %>Routes)
.controller('<%= schema.getName() %>CreateController', <%= schema.getName() %>CreateController)
.controller('<%= schema.getName() %>UpdateController', <%= schema.getName() %>UpdateController)
.controller('<%= schema.getName() %>ListController', <%= schema.getName() %>ListController);

// export the name
export default '<%= schema.getName() %>Entity';
