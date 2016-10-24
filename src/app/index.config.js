export function config($logProvider, $translateProvider, localStorageServiceProvider, NotificationProvider) {
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
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top',
        templateUrl: 'app/ui-notification.html'
    });
}
