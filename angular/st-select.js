export default 'stSelect';

import angular from 'angular';

angular
.module('stSelect', ['smart-table'])
.directive('stSelect', ['$log', '$http', function($log, $http) {
  return {
    restrict: 'E',
    require: '^stTable',
    scope: {
      enum: '=',
      labels: '=',
      sourceUrl: '=',
      predicate: '@',
      predicateExpression: '='
    },
    template: '<select class="input-sm form-control" ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="o._id as o.label for o in collection"></select>',
    link: function($scope, $element, $attr, table) {
      const getPredicate = function() {
        let predicate = $scope.predicate;
        if (!predicate && $scope.predicateExpression) {
          predicate = $scope.predicateExpression;
        }
        return predicate;
      };

      $scope.collection = [{_id: null, label: 'Any'}];
      if ($scope.enum) {
        $scope.enum.forEach(function(v, k) {
          $scope.collection.push({_id: v, label: $scope.labels[k]});
        });

        $scope.selectedOption = $scope.collection[0]._id;
      } else {
        $http($scope.sourceUrl)
        .then(function(response) {
          response.data.list.forEach(function(v) {
            if ($scope.sourceUrl.as_label) {
              v.label = _.get(v, $scope.sourceUrl.as_label);
            }


            $scope.collection.push(v);
          });
        });
      }

      $log.log($scope.collection);

      $scope.optionChanged = function(selectedOption) {
        table.search(selectedOption, getPredicate());
      };
      $scope.optionChanged($scope.selectedOption);
    }
  };
}]);
