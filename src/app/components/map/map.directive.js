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

                console.log('wfs:');
                console.log(d.data);


                console.log('wfs - shape:');
                var polygon = d.data.SHAPE.MultiSurface.surfaceMember.Polygon.exterior.LinearRing.posList;
                console.log(polygon.toString());

                console.log('wfs - gstart :');
                console.log(d.data.GSTART);



                var vectorSource = new self.Map.ol.source.Vector({
                    format: new self.Map.ol.format.GML3(),
                    url: function(extent) {
                        return 'https://gs.novu.io/proxy/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:Contains%3E%3Cogc:PropertyName%3EShape%3C/ogc:PropertyName%3E%3Cgml:Point%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E%3Cgml:pos%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E' + long + '%20' + lat + '%3C/gml:pos%3E%3C/gml:Point%3E%3C/ogc:Contains%3E%3C/ogc:Filter%3E';
                    }
                });

                console.log(vectorSource);

                var vector = new self.Map.ol.layer.Vector({
                    visible: true,
                    name: 'marked-on-map',
                    source: vectorSource,
                    style: new self.Map.ol.style.Style({
                        stroke: new self.Map.ol.style.Stroke({
                            color: 'rgba(0, 0, 255, 1.0)',
                            width: 2
                        })
                    })
                });

                console.log(vector);


                self.Map.addLayer(vector);

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
