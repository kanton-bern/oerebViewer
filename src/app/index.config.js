export function config($logProvider, $translateProvider, localStorageServiceProvider, NotificationProvider, $httpProvider) {
    'ngInject';
    // enable log
    $logProvider.debugEnabled(true);

    // language
    $translateProvider.useStaticFilesLoader({
        prefix: '../app/lang/',
        suffix: '.json'
    });

    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.preferredLanguage('de');

    // storage configuration
    localStorageServiceProvider.setPrefix('oerebApp');
    localStorageServiceProvider.setStorageType('localStorage');

    // notification configuration
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 0,
        startRight: 0,
        verticalSpacing: 1,
        horizontalSpacing: 0,
        positionX: 'right',
        positionY: 'top',
        templateUrl: 'app/ui-notification.html'
    });


    // auth for wfs

    // $httpProvider.interceptors.push('httpRequestInterceptor');

    //
    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic auth';

}
