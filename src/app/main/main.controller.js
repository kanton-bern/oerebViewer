export class MainController {
    constructor($log, $translate, Extracts, Helpers, Map, $scope, $window) {
        'ngInject';

        var self = this;
        this.$scope = $scope;
        this.$translate = $translate;
        this.Extracts = Extracts;
        this.Map = Map;
        this.Helpers = Helpers;
        this.$window = $window;
        this.visibleContent = 'main';

        var mainCtrl = this;

        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.getCurrent();
            mainCtrl.history = Extracts.get().slice().reverse();
        });

        Helpers.registerMenuStatusObserver(function() {
            self.menuStatus = self.Helpers.getMenuStatus();

            if(!self.$scope.$$phase) {
                self.$scope.$apply();
            }
        });


        this.history = Extracts.get();


    }

    reloadPage() {
        this.$window.location.href = '/';
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

    toggleMenu() {
        return this.Helpers.toggleMenu();
    }

    toggleRestriction() {
        this.isRestrictionOpen = !this.isRestrictionOpen;

        if (this.isRestrictionOpen) {
            this.Helpers.closeMenu();
            this.Map.closeSearch();
        }

        return this.isRestrictionOpen;
    }

    showImprint() {
        this.visibleContent = 'imprint';
        this.Helpers.closeMenu();
    }

    showMain() {
        this.visibleContent = 'main';
        this.Helpers.openMenu();
    }

    showGlossary() {
        this.visibleContent = 'glossary';
        this.Helpers.closeMenu();
    }

    showThemes() {
        this.visibleContent = 'themes';
        this.Helpers.closeMenu();
    }

}
