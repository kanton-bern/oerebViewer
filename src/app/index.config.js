export function Config($logProvider, $translateProvider, localStorageServiceProvider, NotificationProvider) {
    'ngInject';

    // log settings:
    $logProvider.debugEnabled(true);

    // language
    $translateProvider.useStaticFilesLoader({
        prefix: '/lang/',
        suffix: '.json'
    });

    $translateProvider.useLocalStorage();

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
        templateUrl: 'ui-notification.html',
    });
}
