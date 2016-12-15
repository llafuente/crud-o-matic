/*<% if (control.frontField.sourceHttp) { %>*/
  $scope["<%= control.cfgModel -%>"] = {
    values: []
  };
  $http(<%= JSON.stringify(control.frontField.sourceHttp) -%>)
  .then(function(response) {
    $scope["<%= control.cfgModel -%>"].values = response.data;
  });
/*<% } else { %>*/
  $scope["<%= control.cfgModel -%>"].values = $injector.get("<%= control.frontField.label_values -%>")();
/*<% } %>*/
