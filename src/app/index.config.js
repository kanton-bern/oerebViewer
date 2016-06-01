export function config($logProvider, toastrConfig, $translateProvider, localStorageServiceProvider) {
    'ngInject';
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;


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
}
