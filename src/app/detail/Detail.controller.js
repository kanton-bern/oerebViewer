export class DetailController {
    constructor($log, $translate, Extracts, Helpers, Map, Layers, $stateParams, $location, $scope, Coordinates) {
        'ngInject';

        let self = this;
        this.Extracts = Extracts;
        this.$location = $location;
        this.Map = Map;
        this.Layers = Layers;
        this.Coordinates = Coordinates;

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

            console.log('execute register restriction observer');
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


        // open detail menu on load
        Extracts.registerCurrentObserverCallback(function() {
            Helpers.openMenu();
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

    isRestrictionActive(code) {
        var restriction = this.Extracts.getRestriction();
        if (restriction) {
            return restriction.code == code;
        }

        return false;
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }
}