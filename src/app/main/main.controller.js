export class MainController {
    constructor($log, $translate, Extracts, Helpers, Map) {
        'ngInject';

        this.$translate = $translate;
        this.Extracts = Extracts;
        this.Map = Map;

        angular.element(document).foundation();

        var mainCtrl = this;



        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.getCurrent();
            mainCtrl.history = Extracts.get().slice().reverse();
        });

        this.history = Extracts.get();

    }


    setCurrentExtract(egrid) {
        if (egrid != this.extract.egrid) {
            this.Extracts.setCurrent(egrid);
        }
    }

    changeLanguage(langKey) {
        this.$translate.use(langKey);
    }

    isCurrentLanguage(langKey) {
        return langKey == this.$translate.use();
    }
}
