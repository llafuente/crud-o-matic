import listHTML from './<%= schema.getName() %>.list.tpl.html';
import createHTML from './<%= schema.getName() %>.create.tpl.html';
import updateHTML from './<%= schema.getName() %>.update.tpl.html';

export default /*@ngInject*/ function <%= schema.getName() %>Routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
  .when('/<%= schema.getPlural() %>', '/<%= schema.getPlural() %>/list');

  $stateProvider
  .state('<%= schema.states.root %>', {
    url: '/<%= schema.getPlural() %>',
    template: '<ui-view></ui-view>',
    // TODO parameter?
    authenticate: true,
    resolve: {},
    data: {
      model: 'entity'
    }
  })
  .state('<%= schema.states.list %>', {
    url: '/list',
    templateUrl: listHTML,
    controller: '<%= schema.getName() %>ListController',
    resolve: {},
    data: {
      model: 'list'
    },
  })
  .state('<%= schema.states.create %>', {
    url: '/create',
    templateUrl: createHTML,
    controller: '<%= schema.getName() %>CreateController',
    resolve: {},
  })
  .state('<%= schema.states.update %>', {
    url: '/update/:<%= schema.apiIdParam %>',
    templateUrl: updateHTML,
    controller: '<%= schema.getName() %>UpdateController',
    resolve: {
      entity: ['$http', '$state', '$stateParams', function($http, $state, $stateParams) {
        return $http({
          method: 'GET',
          url: '<%= schema.apiUrls.read %>/'.replace(':<%= schema.apiIdParam %>', $stateParams.<%= schema.apiIdParam %>)
        }).then(function(res) {
          return res.data;
        });
      }],
    },
    data: {
      model: 'entity'
    }
  });
}
