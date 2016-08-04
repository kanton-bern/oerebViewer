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
    constructor(Layers, $log, $scope, $base64, $window, Oereb, Extracts, Map, Helpers, Coordinates) {
        'ngInject';


        this.$window = $window;
        this.$log = $log;
        this.$base64 = $base64;
        this.Oereb = Oereb;
        this.Extracts = Extracts;
        this.Layers = Layers;
        this.Map = Map;
        this.Helpers = Helpers;

        var self = this;

        // adds observer for clicks on the map
        Map.registerClickObserver(function(coordinates) {

            // close map
            self.Map.closeSearch();

            // if zoom is smaller than 12 don't add an infobox
            if (self.Map.getView().getZoom() < 12) {
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
            self.Oereb.getEGRID(coordinates).then(function (d) {
                self.selectedPoint = d.data;
                self.infoboxLoading = false;
            });

            self.Oereb.getDataFromWFS(coordinates[2056][0], coordinates[2056][1]).then(function (d) {
                // var dipanuf = d.data.FeatureCollection.featureMember.DIPANU_DIPANUF;
                // console.log(dipanuf);

                var long = coordinates[2056][0];
                var lat = coordinates[2056][1];


                var posList = d.data.SHAPE.MultiSurface.surfaceMember.Polygon.exterior.LinearRing.posList;
                var posList = posList.toString().split(" ");

                var ring = [];

                for (var i = 0; i < posList.length; i=i+2) {
                    var temporary = Coordinates.create(Coordinates.System[2056], [posList[i], posList[i+1]]);
                    ring.push([temporary[21781][0], temporary[21781][1]]);
                }


                var polygon = new ol.geom.Polygon([ring]);

                // Create feature with polygon.
                var feature = new ol.Feature(polygon);

                // Create vector source and the feature to it.
                var vectorSource = new ol.source.Vector();
                vectorSource.addFeature(feature);

                // Create vector layer attached to the vector source.
                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });

                vectorLayer.setZIndex(5000);
                // Add the vector layer to the map.
                self.Map.addSelectedLayer(vectorLayer);

            });

        });


        // load map
        this.map = Map.map;

        // load geoloaction parameters
        this.mobileGeolocationOptions = Map.mobileGeolocationOptions;
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
