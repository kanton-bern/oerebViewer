export function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('home.detail', {
            url: '/d/:egrid',
            params: {
                egrid: '',
            },
            templateUrl: 'app/detail/detail.html',
            controller: 'DetailController',
            controllerAs: 'detail'
        })
        .state('home.detail.restriction', {
            url: '/r/:restriction',
            params: {
                restriction: ''
            },
            templateUrl: 'app/restriction/restriction.html',
            controller: 'RestrictionController',
            controllerAs: 'restriction'
        });

    $urlRouterProvider.otherwise('/d/0');
}
