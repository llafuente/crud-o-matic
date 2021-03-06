export default 'stDateRange';

import angular from 'angular';
import template from './st-date-range.tpl.html';

angular
.module('stDateRange', ['smart-table'])
.directive('stDateRange', [function() {
  return {
    restrict: 'E',
    require: '^stTable',
    scope: {
      before: '=',
      after: '='
    },
    templateUrl: template,

    link: function($scope, element, attr, table) {
      $scope.filter = {};
      const predicateName = attr.predicate;

      $scope.$watch('filter', function(a/*, b*/) {
        if (a.before || a.after) {
          const f = {};

          if (a.before) {
            f.$gt = a.before;
          }

          if (a.after) {
            f.$lt = a.after;
          }

          table.search(f, predicateName);
        } else {
          table.search(null, predicateName);
        }
      }, true);

        /*
        [inputBefore, inputAfter].forEach(function(input) {

          input.bind('blur', function() {
            var query = {};

            if (!scope.isBeforeOpen && !scope.isAfterOpen) {
              if (scope.before) {
                query.before = scope.before;
              }

              if (scope.after) {
                query.after = scope.after;
              }

              scope.$apply(function() {
                table.search(query, predicateName);
              });
            }
          });
        });
        */
    }
  };
}]);
