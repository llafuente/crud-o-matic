/*<% if (control.source_url) { %>*/
  $scope.<%= control.cfgModel %>_values = [];
  $http(<%- JSON.stringify(control.frontField.source_url) %>)
  .then(function(response) {
    $scope.<%= control.cfgModel %>_values = response.data.list;
  });
/*<% } else { %>*/
  $scope.<%= control.cfgModel%>_values = $injector.get('<%= control.backField.name %>Values');
/*<% } %>*/
