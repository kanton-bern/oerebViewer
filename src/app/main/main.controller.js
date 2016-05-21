export class MainController {
    constructor($log, $translate, Extracts, Helpers) {
        'ngInject';

        this.$translate = $translate;
        this.Extracts = Extracts;

        this.isDetailMode = false;

        angular.element(document).foundation();
        
        var mainCtrl = this;

        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.getCurrent();
            mainCtrl.history = Extracts.get().slice().reverse();
            this.isDetailMode = true;
        });

        Extracts.registerRestrictionObserverCallback(function() {
            if (!mainCtrl.Extracts.getRestriction()) {
                // mainCtrl.toggleRestriction = false;
            } else {
                // angular.element('#buttonShowExtract').click();
                //mainCtrl.toggleRestriction = true;
            }
        });


        this.history = Extracts.get();
    }

    toggleMode() {
        this.isDetailMode = !this.isDetailMode;
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
