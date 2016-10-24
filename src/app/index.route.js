export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('home.detail', {
            url: 'd/:egrid?restriction',
            params: {
                egrid: ''
            },
            reloadOnSearch: false,
            templateUrl: 'app/detail/detail.html',
            controller: 'DetailController',
            controllerAs: 'detail'
        });

    $urlRouterProvider.otherwise('/d/0');
}
