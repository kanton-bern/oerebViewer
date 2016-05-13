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

        Extracts.registerRestrictionObserverCallback(function() {


            console.log('restrictionReloadTriggered');
            // move the slider to the right position here, thats all

            if (!mainCtrl.Extracts.getRestriction()) {
                mainCtrl.toggleRestriction = false;
            } else {
                mainCtrl.toggleRestriction = true;
                console.log(mainCtrl.Extracts.current.restrictions);
            }

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
