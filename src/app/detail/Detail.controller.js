export class DetailController {
    constructor($log, $translate, Extracts, Helpers, Map, $stateParams, $location, $scope) {
        'ngInject';

        let self = this;
        this.Extracts = Extracts;
        this.$location = $location;

        this.noDatas = true;
        if ($stateParams.egrid == 0) {
            this.noDatas = false;
        } else {
            this.addExtract($stateParams.egrid);
        }

        // triggers restriction changed at startup
        this.restrictionChanged(false);

        // if location searchpath is changed, restrictionchanges
        $scope.$on('$locationChangeSuccess', function () {
            self.restrictionChanged(true);
        });

        // set map position
        // Map.setPosition()
        Extracts.registerCurrentObserverCallback(function() {
            // reset position on map
            var wmsLink = self.Extracts.getCurrent().data.RealEstate.PlanForLandRegister.ReferenceWMS;
            var bbox = Helpers.getParameterByName('bbox', wmsLink);

            var coords = Map.transformFrom2056(Helpers.getCenterOfBBBOX(bbox));

            Map.setPosition(coords[0], coords[1]);
        });



        angular.element('aside').foundation();

        // Menubutton in header will change to cross [x] if menu is open.
        var $menuNav = angular.element('.menu-nav');
        var $panel = angular.element('#menuLeftSlider');

        if ($panel.attr('aria-expanded')=='true') {
          $log.debug('active');
        }
    }

    restrictionChanged(notify) {
        if (angular.isUndefined(this.$location.search().restriction))
            return;


        this.Extracts.setRestrictionByCode(
            this.$location.search().restriction,
            notify
        );
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }
}