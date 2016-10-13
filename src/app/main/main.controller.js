export class MainController {
    constructor($log, $translate, Extracts, Helpers, Map) {
        'ngInject';

        this.$translate = $translate;
        this.Extracts = Extracts;
        this.Map = Map;
        this.Helpers = Helpers;
        this.visibleContent = 'main';

        // todo new-menu
        // angular.element(document).foundation();

        var mainCtrl = this;

        Extracts.registerCurrentObserverCallback(function() {
            mainCtrl.extract = mainCtrl.Extracts.getCurrent();
            mainCtrl.history = Extracts.get().slice().reverse();

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

    getMenuStatus() {
        return this.Helpers.getMenuStatus();
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
