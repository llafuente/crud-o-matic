/*<% if (control.sourceHttp) { %>*/
  $scope.<%= control.cfgModel %>_values = [];
  $http(<%= JSON.stringify(control.frontField.sourceHttp) %>)
  .then(function(response) {
    $scope.<%= control.cfgModel%>_values = response.data;
  });
/*<% } else { %>*/
  $scope.<%= control.cfgModel%>_values = $injector.get("<%= control.label_values%>")();
/*<% } %>*/
