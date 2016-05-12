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
            mainCtrl.history = Extracts.get().slice().reverse();
            
            console.log('mainCtrl');
            console.log(mainCtrl.extract);
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
