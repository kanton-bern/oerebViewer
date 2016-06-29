export class HelpersService {
    constructor() {

        'ngInject';

    }

    // Close the search box
    closeSearch() {
      //if(angular.element('.search-input').attr('aria-hidden') == 'false')
        //$('.search-input').hide();
      // [bs][todo] Hier sollte ein Helper zum öffnen und schliessen der Sucheingabe kommen.
      alert("Jetzt müsste .search-input geschlossen werden.");

    }

    closeMenu() {
        if (angular.element('#menuLeftSlider').attr('aria-expanded') == 'true')
            $('#menuLeftSlider').foundation('toggle');
    }

    openMenu() {
        if (angular.element('#menuLeftSlider').attr('aria-expanded') == 'false')
            $('#menuLeftSlider').foundation('toggle');
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
