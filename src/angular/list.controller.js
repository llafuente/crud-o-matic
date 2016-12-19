/* eslint-disable */
export default class <%= schema.getName() %>ListController {
  constructor($rootScope, $scope, $http, $log) {
    $log.debug('(<%= schema.getName() %>ListController) start');

    let lastTablestate;

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
        for (const i in tablestate.search.predicateObject.query) { // eslint-disable-line guard-for-in
          $log.debug(i, tablestate.search.predicateObject.query[i]);
          qs.where[i] = tablestate.search.predicateObject.query[i];
        }
      }

      return qs;
    }

    $scope.getList = function(tablestate) {
      lastTablestate = tablestate;
      const qs = buildQuerystring(tablestate);
      const pagination = tablestate.pagination;

      return $http({
        method: 'GET',
        url: '<%= schema.apiUrls.list %>',
        params: qs
      }).then(function(res) {
        $scope.list = res.data;
        pagination.totalItemCount = res.data.count;

        pagination.start = res.data.offset;
        pagination.number = res.data.limit;

        pagination.numberOfPages = res.data.count / res.data.limit;
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
