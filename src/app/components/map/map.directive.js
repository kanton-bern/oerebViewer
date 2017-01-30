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
    constructor(Config, Layers, $log, $base64, $window, OEREB, WFS, Extracts, Map, Helpers, Coordinates, Notification) {
        'ngInject';

        this.Config = Config;
        this.$window = $window;
        this.$log = $log;
        this.$base64 = $base64;
        this.OEREB = OEREB;
        this.WFS = WFS;
        this.Extracts = Extracts;
        this.Layers = Layers;
        this.Map = Map;
        this.Helpers = Helpers;
        this.Coordinates = Coordinates;
        this.Notification = Notification;
        this.ol = ol;

        var self = this;

        this.activeLayer = 'greyMap';

        // adds observer for clicks on the map
        Map.registerClickObserver(function(coordinates) {

            // close menu
            var menuStatus = self.Helpers.getMenuStatus();

            if (menuStatus)
                self.Helpers.closeMenu();

            // close map
            self.Map.closeSearch();

            // if zoom is smaller than config.zoom.oereb
            if (self.Map.getView().getZoom() < self.Config.zoom.oerebLayer || menuStatus) {
                return;
            }

            // creates an overlay over the openlayers api
            var popup = new Map.ol.Overlay({
                element: document.getElementById('infobox')
            });

            self.Map.lastOverlay = popup;

            // add the overlay 'popup' to the map
            Map.addOverlay(popup);

            $('#object-information').hide();

            var element = popup.getElement();

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
                    self.Notification.error('In diesem ÖREB Kataster sind keine Informationen zu diesem Grundstück vorhanden.');
                }
            );

            self.WFS.getSource(coordinates).then(function (vectorSource) {
                self.drawByWFSSource(vectorSource, 'clicked');
            });

        });

        Extracts.registerCurrentObserverCallback(function(reloading) {
            reloading = reloading || false;

            var egrid = self.Extracts.getCurrent().egrid;

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

    // restore permalink
    restore() {
        if (window.location.hash.indexOf('?') !== -1) {

            // try to restore center, zoom-level and rotation from the URL
            var basedHash = window.location.hash.replace('#/?', '') + '=';
            // var parts = hash.split('/');

            var hash = this.$base64.decode(basedHash);
            var parts = hash.split('/');

            if (parts.length === 3) {
                this.zoom = parseInt(parts[0], 10);
                this.center = [
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ];
            }
        }
    }

    getLocation() {
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
}
