export class DetailController {
    constructor($log, $translate, Extracts, Helpers, Map, Layers, $stateParams, $location, $scope) {
        'ngInject';

        let self = this;
        this.Extracts = Extracts;
        this.$location = $location;
        this.Map = Map;
        this.Layers = Layers;

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

        // on restriction reload add layer to map
        this.Extracts.registerRestrictionObserverCallback(function() {

            self.tempLayers = [];

            let bbox = '';

            angular.forEach(self.Extracts.getRestriction().values, function (v) {
                bbox = Helpers.getParameterByName('bbox', v.Map.ReferenceWMS);

                var url = v.Map.ReferenceWMS.substr(0, v.Map.ReferenceWMS.indexOf('WMSServer?')) + 'WMSServer?';

                var wmsTempSource = new self.Map.ol.source.TileWMS(({
                    url: url,
                    params: {
                        'LAYERS': Helpers.getParameterByName('LAYERS', v.Map.ReferenceWMS),
                        'TILED': true,
                        'VERSION': Helpers.getParameterByName('VERSION', v.Map.ReferenceWMS),
                        'FORMAT': Helpers.getParameterByName('FORMAT', v.Map.ReferenceWMS),
                        'CRS': Helpers.getParameterByName('CRS', v.Map.ReferenceWMS)
                    },
                    serverType: 'geoserver'
                }));

                let wmsTemp = new self.Map.ol.layer.Tile({
                    /*preload: Infinity,*/
                    visible: true,
                    source: wmsTempSource,
                    name: 'restriction-temp'
                });

                self.tempLayers.push(wmsTemp);
            });

            self.Map.addTempLayers(self.tempLayers);

        });


        // set map position
        Extracts.registerCurrentObserverCallback(function() {
            // reset position on map
            var wmsLink = self.Extracts.getCurrent().data.RealEstate.PlanForLandRegister.ReferenceWMS;
            var bbox = Helpers.getParameterByName('bbox', wmsLink);

            var coords = Map.transformFrom2056(Helpers.getCenterOfBBBOX(bbox));

            Map.setPosition(coords[0], coords[1]);
            Map.setZoom(15);
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