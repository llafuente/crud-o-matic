angular
.module('Model<%= schema.getName() %>', [])
.controller('<%= schema.getName() %>CreateController', <%= schema.getName() %>CreateController)
.controller('<%= schema.getName() %>UpdateController', <%= schema.getName() %>UpdateController);
