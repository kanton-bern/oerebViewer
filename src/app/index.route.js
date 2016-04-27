export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('detail', {
            url: '/detail/:egrid',
            params: {
                egrid: '',
            },
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        });

    $urlRouterProvider.otherwise('/');
}
