export class MainController {
    constructor($log, $translate, Extracts, Helpers, Map) {
        'ngInject';

        this.$translate = $translate;
        this.Extracts = Extracts;
        this.Map = Map;

        this.isDetailMode = Map.isDetailMode();

        Map.setMapMode();

        angular.element(document).foundation();
        
        var mainCtrl = this;

        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.getCurrent();
            mainCtrl.history = Extracts.get().slice().reverse();
            console.log('detail Mode: ');
            mainCtrl.Map.setDetailMode();
        });

        Extracts.registerRestrictionObserverCallback(function() {
            if (!mainCtrl.Extracts.getRestriction()) {
                // mainCtrl.toggleRestriction = false;
            } else {
                // angular.element('#buttonShowExtract').click();
                //mainCtrl.toggleRestriction = true;
            }
        });

        Map.onModeChanged(function(isDetailMode) {
            mainCtrl.isDetailMode = isDetailMode;
        });

        this.history = Extracts.get();
    }

    toggleMode() {
        this.Map.toggleMode();
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
