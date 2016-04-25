export class MainController {
    constructor($log, $translate) {
        'ngInject';

        this.$translate = $translate;

        angular.element(document).foundation();
    }

    changeLanguage(langKey) {
        this.$translate.use(langKey);
    }
}
