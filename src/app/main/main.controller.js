export class MainController {
    constructor($log, $translate, Extracts) {
        'ngInject';

        this.$translate = $translate;
        this.Extracts = Extracts;

        angular.element(document).foundation();

        this.extract = Extracts.current;

        var mainCtrl = this;

        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.current;

            console.log(mainCtrl.extract);
        });
    }

    changeLanguage(langKey) {
        this.$translate.use(langKey);
    }
}
