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

// use: WGS84 bzw. EPSG:4326

class MapController {
    constructor(Layers, $log, $base64, $window, Oereb, Extracts, Map, Helpers, Coordinates, Notification) {
        'ngInject';

        this.$window = $window;
        this.$log = $log;
        this.$base64 = $base64;
        this.Oereb = Oereb;
        this.Extracts = Extracts;
        this.Layers = Layers;
        this.Map = Map;
        this.Helpers = Helpers;
        this.Coordinates = Coordinates;
        this.Notification = Notification;

        var self = this;

        // adds observer for clicks on the map
        Map.registerClickObserver(function(coordinates) {

            // close menu
            var menuStatus = self.Helpers.getMenuStatus();

            if (menuStatus)
                self.Helpers.closeMenu();


            // close map
            self.Map.closeSearch();

            // if zoom is smaller than 12 don't add an infobox
            if (self.Map.getView().getZoom() < 12 || menuStatus) {
                return;
            }

            // creates an overlay over the openlayers api
            var popup = new Map.ol.Overlay({
                element: document.getElementById('infobox')
            });

            self.lastOverlay = popup;

            // add the overlay 'popup' to the map
            Map.addOverlay(popup);

            $('#object-information').hide();

            var element = popup.getElement();

            $(element).hide();
            $(element).show();

            popup.setPosition(coordinates[21781]);

            self.selectedPoint = [];
            self.infoboxLoading = true;
            self.Oereb.getEGRID(coordinates).then(
                function (d) {
                    self.selectedPoint = d.data;
                    self.infoboxLoading = false;
                },
                function(data) {
                    self.Notification.error('In diesem ÖREB Kataster sind keine Informationen zu diesem Grundstück vorhanden.');
                }
            );

            self.Oereb.getDataFromWFS(coordinates).then(function (d) {
                self.drawByWFS(d);
            });

        });

        Extracts.registerCurrentObserverCallback(function() {
            var egrid = self.Extracts.getCurrent().egrid;

            self.Oereb.getDataFromWFS(egrid).then(function (d) {
                var posList = self.getPoslistFromWFS(d);
                var polygon = Map.createPolygon(posList);

                self.drawByPolygon(polygon);

                var size = Map.map.getSize();
                Map.map.getView()
                    .fit(polygon, size, {padding: [200, 200, 200, 200], constrainResolution: false});
            });


            Helpers.openMenu();

        });


        // load map
        this.map = Map.map;

        // load geoloaction parameters
        this.mobileGeolocationOptions = Map.mobileGeolocationOptions;
    }

    drawByWFS(d) {
        var posList = this.getPoslistFromWFS(d);
        var polygon = this.Map.createPolygon(posList);

        this.Map.addSelectedLayer(polygon);
    }

    drawByPolygon(polygon) {
        this.Map.addSelectedLayer(polygon);
    }

    getPoslistFromWFS(d) {
        var posList = [];
        angular.forEach(d.data, function (data) {

            if (angular.isUndefined(data))
                return;

            var cPosList = data.DIPANU_DIPANUF.SHAPE.MultiSurface.surfaceMember.Polygon.exterior.LinearRing.posList;
            cPosList = cPosList.toString().split(" ");
            angular.extend(posList, cPosList);
        });

        return posList;
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

    removeOverlay() {
        if (angular.isDefined(this.lastOverlay))
            return this.Map.removeOverlay(this.lastOverlay);
        return false;

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    showOverlay() {
        if (angular.isDefined(this.lastOverlay))
            return this.Map.addOverlay(this.lastOverlay);

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    zoomOut() {
        this.Map.zoomOut();

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    showLayer(name) {
        if (name == 'ortho') {
            this.Layers.show('ortho');
            this.Layers.hide('aerial');
        }

        if (name == 'aerial') {
            this.Layers.show('aerial');
            this.Layers.hide('ortho');
        }

        this.Helpers.closeMenu();
    }

    isLayerActive(name) {
        return this.Layers.isActive(name);
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
