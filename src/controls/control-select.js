/*<% if (control.frontField.source_url) { %>*/
  $scope.<%= control.cfgModel %>_values = [];
  $http(<%- JSON.stringify(control.frontField.source_url) %>)
  .then(function(response) {
    <% if(control.frontField.source_url.as_label) { %>
      response.data.list.forEach(function(v) {
        v.label = _.get(v, '<%= control.frontField.source_url.as_label %>')
      });
    <% } %>
    $scope.<%= control.cfgModel %>_values = response.data.list;
  });
/*<% } else { %>*/
  $scope.<%= control.cfgModel%>_values = $injector.get('<%= control.backField.name %>Values');
/*<% } %>*/
