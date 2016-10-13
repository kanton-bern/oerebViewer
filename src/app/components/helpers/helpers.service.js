export class HelpersService {
    constructor() {
        'ngInject';

        this.menuStatus = false;
    }

    closeMenu() {
        this.menuStatus = false;
    }

    openMenu() {
        this.menuStatus = true;
    }

    toggleMenu() {
        this.menuStatus = !this.menuStatus;
    }

    getMenuStatus() {
        return this.menuStatus;
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    getCenterOfBBBOX(bbox) {
        var parts = bbox.split(',');

        return [
            (parseFloat(parts[0])+parseFloat(parts[2]))/2,
            (parseFloat(parts[1])+parseFloat(parts[3]))/2
        ];
    }

}
