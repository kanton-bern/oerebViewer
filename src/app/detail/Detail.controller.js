export class DetailController {
    constructor($log, $translate, Extracts, $stateParams) {
        'ngInject';

        this.Extracts = Extracts;


        this.noDatas = true;
        if ($stateParams.egrid == 0) {
            this.noDatas = false;
        } else {
            this.addExtract($stateParams.egrid);
        }

        angular.element('aside').foundation();

        // Menubutton in header will change to cross [x] if menu is open.
        var $menuNav = angular.element('.menu-nav');
        var $panel = angular.element('#menuLeftSlider');

        if ($panel.attr('aria-expanded')=='true') {
          $log.debug('active');
        }
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }
}
