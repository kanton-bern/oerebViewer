'use strict';

/**
 * @ngdoc overview
 * @name oerebApp
 * @description
 * # oerebApp
 *
 * Main module of the application.
 */

function configRouting($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    // MAIN ABSTRACT STATE, ALWAYS ON
        .state('main', {
            abstract: true,
            url: '',
            controller: 'MainCtrl as Main',
            templateUrl: 'views/main.html'
        })

        .state('main.home', {
            url: '/',
            controller: 'HomeCtrl as Home',
            templateUrl: 'views/home.html'
        })

        .state('main.detail', {
            url: '/detail',
            controller: 'DetailCtrl as Detail',
            templateUrl: 'views/detail.html',
        });
}

function configTranslation ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('de'); // is applied on first load
    $translateProvider.useLocalStorage();// saves selected language to localStorage
}

angular
    .module('oerebApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'pascalprecht.translate',// angular-translate
        'tmh.dynamicLocale', // angular-dynamic-locale
        'ngeo',
        'siyfion.sfTypeahead',
        'base64',
    ])
    .config(configRouting)
    .config(configTranslation)
    .constant('LOCALES', {
        'locales': {
            'en': 'English',
            'de': 'Deutsch',
        },
        'preferredLocale': 'de'
    });

