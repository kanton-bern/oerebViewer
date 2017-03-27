export function MapDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/map/map.html',
        controller: MapController,
        controllerAs: 'map',
        bindToController: true
    };

    return directive;
}

class MapController {
    constructor(Config, Layers, $log, $state, $base64, $window, OEREB, WFS, Extracts, Map, Helpers, Coordinates, Notification, $filter) {
        'ngInject';

        this.Config = Config;
        this.$window = $window;
        this.$log = $log;
        this.$state = $state;
        this.$base64 = $base64;
        this.OEREB = OEREB;
        this.WFS = WFS;
        this.Extracts = Extracts;
        this.Layers = Layers;
        this.Map = Map;
        this.Helpers = Helpers;
        this.Coordinates = Coordinates;
        this.Notification = Notification;
        this.$filter = $filter;
        this.ol = ol;

        let self = this;

        this.activeLayer = 'greyMap';

        // adds observer for clicks on the map
        Map.registerClickObserver(function(coordinates, force = false) {
            // close menu
            let menuStatus = self.Helpers.getMenuStatus();

            if (menuStatus)
                self.Helpers.closeMenu();

            // close map
            self.Map.closeSearch();

            if (!force && (self.Map.getView().getZoom() < self.Config.zoom.oerebLayer || menuStatus)) {
                return;
            }

            if (force) {
                self.Map.setZoom(self.Config.zoom.zoomedIn);
            }

            // creates an overlay over the openlayers api
            let popup = new Map.ol.Overlay({
                element: document.getElementById('infobox')
            });

            self.Map.lastOverlay = popup;

            // add the overlay 'popup' to the map
            Map.addOverlay(popup);

            $('#object-information').hide();

            let element = popup.getElement();

            $(element).hide();
            $(element).show();

            popup.setPosition(coordinates[2056]);

            self.selectedPoint = [];
            self.infoboxLoading = true;
            self.OEREB.getEGRID(coordinates).then(
                function (d) {
                    self.selectedPoint = d.data;
                    self.infoboxLoading = false;
                },
                function(data) {
                    self.Notification.error(
                        self.$filter('translate')('notification_nodata')
                    );
                }
            );

            self.WFS.getSource(coordinates).then(function (vectorSource) {
                self.drawByWFSSource(vectorSource, 'clicked');
            });

        });

        Extracts.registerCurrentObserverCallback(function(reloading) {
            reloading = reloading || false;

            let egrid = self.Extracts.getCurrent().egrid;

            if (!reloading)
                self.WFS.getSource(egrid).then(function (vectorSource) {
                    self.drawByWFSSource(vectorSource, 'selected');
                    self.Map.getView().fit(vectorSource.getExtent(), (self.Map.getSize()));
                });
        });

        // load map
        this.map = Map.map;

        // load geolocation parameters
        this.mobileGeolocationOptions = Map.mobileGeolocationOptions;
    }

    drawByWFSSource(source, addLayerMethod) {
        if (addLayerMethod == 'clicked')
            this.Map.addClickedLayer(source);

        if (addLayerMethod == 'selected')
            this.Map.addSelectedLayer(source);
    }

    getLocation() {
        let self = this;

        // Click on Center
        setTimeout(function() {
            let currentCenter = self.Map.getCenter();
            self.Map.click(currentCenter, true);
        }, 1000);

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    zoomIn() {
        this.Map.zoomIn();
        // Close main menu if open
        this.Helpers.closeMenu();

    }

    noData() {
      return this.Detail.noDatas();
    }

    removeOverlay() {
        if (angular.isDefined(this.Map.lastOverlay))
            return this.Map.removeOverlay(this.Map.lastOverlay);
        return false;

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    showOverlay() {
        if (angular.isDefined(this.Map.lastOverlay))
            return this.Map.addOverlay(this.Map.lastOverlay);

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    zoomOut() {
        this.Map.zoomOut();

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    showLayer(name) {
        this.activeLayer = name;

        if (name == 'greyMap') {
            this.Layers.show('greyMap');
            this.Layers.hide('orthoPhoto');
        }

        if (name == 'orthoPhoto') {
            this.Layers.show('orthoPhoto');
            this.Layers.hide('greyMap');
        }

        this.Helpers.closeMenu();
    }

    toggleSearch() {
        this.Map.toggleSearch();
        // Close main menu if open
        this.Helpers.closeMenu();
    }

    isSearchOpen() {
        return this.Map.isSearchOpen;
    }

    openDetail(egrid) {
        this.$state.go('home.detail', {egrid: egrid, restriction: 'none'});
    }
}
