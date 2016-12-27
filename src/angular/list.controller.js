/* eslint-disable */
export default class <%= schema.getName() %>ListController {
  constructor($rootScope, $scope, $http, $log) {
    $log.debug('(<%= schema.getName() %>ListController) start');

    let lastTablestate;
    const operators = <%- JSON.stringify(_.fromPairs(
      _.filter(controls, function(control) {
        return !!control.frontField.operator;
      }).map(function(control) {
        return [control.realpath, control.frontField.operator];
      })
    ), null, 2); %>

    function buildQuerystring(tablestate) {
      const pagination = tablestate.pagination;
      //pagination.start = pagination.start || 0;
      $log.debug('(*list)', JSON.stringify(tablestate));

      const qs = {
        limit: 10,
        where: {}
      };

      if (tablestate.sort && tablestate.sort.predicate) {
        qs.sort = (tablestate.sort.reverse ? '-' : '') + tablestate.sort.predicate;
      }

      qs.offset = pagination.start || 0;

      if (tablestate.search && tablestate.search.predicateObject
        && tablestate.search.predicateObject.query) {
        const q = tablestate.search.predicateObject.query;
        for (const i in q) { // eslint-disable-line guard-for-in
          $log.debug(i, q[i]);
          if (q[i].value !== undefined) {
            qs.where[i] = q[i];
            if (operators[i]) {
              qs.where[i].operator = operators[i];
            }
          }
        }
      }

      return qs;
    }

    $scope.getList = function(tablestate) {
      lastTablestate = tablestate;
      const qs = buildQuerystring(tablestate);

      return $http({
        method: 'GET',
        url: '<%= schema.apiUrls.list %>',
        params: qs
      }).then(function(res) {
        $scope.list = res.data;
        tablestate.pagination.totalItemCount = res.data.count;

        tablestate.pagination.start = res.data.offset;
        tablestate.pagination.number = res.data.limit;

        tablestate.pagination.numberOfPages = Math.ceil(res.data.count / res.data.limit);
      });
    };

    $scope.download = function(type) {
      const qs = buildQuerystring(lastTablestate);

      return $http({
        method: 'GET',
        url: '<%= schema.apiUrls.list %>',
        params: qs,
        headers: {
          'Accept': type
        }
      }).then(function(res) {
        $log.debug(res.data);
      });
    };

    $scope.delete = function(idx, row) {
      $http({
        method: 'DELETE',
        url: '<%= schema.apiUrls.delete %>/'.replace(':<%= schema.apiIdParam %>', row._id)
      }).then(function() {
        $scope.list.list.splice(idx, 1);
        --$scope.list.count;
      });
    };
  }
}
