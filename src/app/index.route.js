export function RouterConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $stateProvider
        .state('home', {
            url: '/',
            template: require('./main/main.html'),
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('home.detail', {
            url: 'd/:egrid?restriction',
            params: {
                egrid: ''
            },
            reloadOnSearch: false,
            template: require('./detail/detail.html'),
            controller: 'DetailController',
            controllerAs: 'detail'
        });

    $urlRouterProvider.otherwise('/d/0');
}
