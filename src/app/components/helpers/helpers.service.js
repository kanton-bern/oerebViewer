export class HelpersService {
    constructor() {
        'ngInject';

        this.menuStatus = false;
        this.menuStatusObserver = [];
    }

    closeMenu() {
        this.menuStatus = false;
        this.notifyMenuStatusObservers();
    }

    openMenu() {
        this.menuStatus = true;
        this.notifyMenuStatusObservers();
    }

    toggleMenu() {
        if (this.menuStatus)
            this.closeMenu();
        else
            this.openMenu();
    }

    getMenuStatus() {
        return this.menuStatus;
    }


    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    getCenterOfBBBOX(bbox) {
        let parts = bbox.split(',');

        return [
            (parseFloat(parts[0])+parseFloat (parts[2]))/2,
            (parseFloat(parts[1])+parseFloat(parts[3]))/2
        ];
    }

    registerMenuStatusObserver(callback) {
        this.menuStatusObserver.push(callback);
    }

    notifyMenuStatusObservers() {
        angular.forEach(this.menuStatusObserver, function (callback) {
            callback();
        });
    }
}
