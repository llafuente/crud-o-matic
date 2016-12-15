export default class <%= schema.getName() %>UpdateController {
  constructor($rootScope, $scope, $http, $state, confirmStateExit, $log, $injector) {
    confirmStateExit($scope, "form.$dirty && !submitted");

    $scope.crud_action = 'update';
    $scope.entity = entity;
    $scope.submitted = false;
    $scope.submitting = false;

    $scope.submit = function() {
      if ($scope.submitting) return;

      // TODO gather only changes!

      $scope.submitting = true;
      $http({
        method: 'PATCH',
        url: '<%= schema.apiUrls.update %>/'.replace(':<%= schema.apiIdParam %>', $stateParams['<%= schema.apiIdParam %>']),
        data: $scope.entity,
      }).then(function() {
        $scope.submitted = true;
        $state.go("^.list");
      })
      .finally(function() {
        $scope.submitting = false;
      });
    }

    <%= controlsJS %>;
  }
}
