/* eslint-disable */
export default class <%= schema.getName() %>UpdateController {
  constructor($scope, $http, entity, $state, $stateParams, $log, $injector) {
    $log.debug('(<%= schema.getName() %>UpdateController) start');

    // TODO
    // confirmStateExit($scope, 'form.$dirty && !submitted');

    $scope.crud_action = 'update';
    $scope.entity = entity;
    $scope.submitted = false;
    $scope.submitting = false;

    $scope.submit = function() {
      if ($scope.submitting) {
        return;
      }

      // TODO gather only changes!

      $scope.submitting = true;
      $http({
        method: 'PATCH',
        url: '<%= schema.apiUrls.update %>/'.replace(':<%= schema.apiIdParam %>', $stateParams.<%= schema.apiIdParam %>),
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
