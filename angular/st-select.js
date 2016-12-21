export default 'stSelect';

import angular from 'angular';

angular
.module('stSelect', ['smart-table'])
.directive('stSelect', ['$log', function($log) {
  return {
    restrict: 'E',
    require: '^stTable',
    scope: {
      enum: '=',
      labels: '=',
      predicate: '@',
      predicateExpression: '='
    },
    template: '<select class="input-sm form-control" ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="o._id as o.label for o in collection"></select>',
    link: function($scope, $element, $attr, table) {
      var getPredicate = function() {
        var predicate = $scope.predicate;
        if (!predicate && $scope.predicateExpression) {
          predicate = $scope.predicateExpression;
        }
        return predicate;
      };

      $scope.collection = [{_id: null, label: 'Any'}];
      $scope.enum.forEach(function(v, k) {
        $scope.collection.push({_id: v, label: $scope.labels[k]});
      });

      $scope.selectedOption = $scope.collection[0]._id;

      $log.log($scope.collection);

      $scope.optionChanged = function(selectedOption) {
        table.search(selectedOption, getPredicate());
      };
      $scope.optionChanged($scope.selectedOption);
    }
  };
}]);
