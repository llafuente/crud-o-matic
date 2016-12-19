/* eslint-disable */
export default class <%= schema.getName() %>CreateController {
  constructor($scope, $http, $state, $log, $injector) {
    $log.debug('(<%= schema.getName() %>CreateController) start');

    // TODO
    // confirmStateExit($scope, 'form.$dirty && !submitted');

    $scope.crud_action = 'create';
    $scope.entity = {
    }; // TODO defaults!

    $scope.submitted = false;
    $scope.submitting = false;

    $scope.submit = function() {
      if ($scope.submitting) {
        return;
      }

      $scope.submitting = true;
      $http({
        method: 'POST',
        url: '<%= schema.apiUrls.create %>',
        data: $scope.entity,
      }).then(function() {
        $scope.submitted = true;
        $state.go('^.list');
      })
      .finally(function() {
        $scope.submitting = false;
      });
    };

    /* control specific JS ($injector used here) */

    <%- controlsJS %>

  }
}
