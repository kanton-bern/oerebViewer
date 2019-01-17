export class MainController {
    constructor($translate, Extracts, Helpers, Map, $scope, $rootScope, $window) {
        'ngInject';

        var self = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$translate = $translate;
        this.Extracts = Extracts;
        this.Map = Map;
        this.Helpers = Helpers;
        this.$window = $window;
        this.visibleContent = 'main';
        this.languageChangedByHuman = false;
        let mainCtrl = this;

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

        // $translate bug: this event gets triggered on init in the built version
        $rootScope.$on('$translateChangeSuccess', () => {
            if (this.languageChangedByHuman) {
                this.Extracts.reload();
            }
        });


        this.history = Extracts.get();
    }

    reloadPage() {
        this.$window.location.href = '/';
    }

    changeLanguage(langKey) {
        this.languageChangedByHuman = true;
        this.$translate.use(langKey);
    }

    isCurrentLanguage(langKey) {
        return langKey === this.$translate.use();
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

    swipeLeft() {
        this.Helpers.closeMenu();
    }

    centerObject(){
        this.Map.centerObject()
    }
}
