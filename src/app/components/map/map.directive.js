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
    constructor(Layers, $log, $scope, $base64, $window, Oereb, Extracts, Map, Helpers) {
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

        Map.registerClickObserver(function(event) {

            self.Map.closeSearch();

            console.log('wfs:');

            if (self.Map.getView().getZoom() < 12) {
                return;
            }

            self.infocords = event.coordinate;

            var popup = new Map.ol.Overlay({
                element: document.getElementById('infobox')
            });

            self.lastOverlay = popup;
            Map.addOverlay(popup);

            $('#object-information').hide();

            var element = popup.getElement();

            $(element).hide();
            $(element).show();

            popup.setPosition(event.coordinate);

            var cords = Map.transform(event.coordinate);

            self.selectedPoint = [];
            self.infoboxLoading = true;
            self.Oereb.getEGRID(cords[1], cords[0]).then(function (d) {
                self.selectedPoint = d.data;
                self.infoboxLoading = false;
            });
        });



        // load map
        this.map = Map.map;

        // load geoloaction parameters
        this.mobileGeolocationOptions = Map.mobileGeolocationOptions;

        /*this.zoomIn = function () {
            this.$log.warn('zoomIn');
            self.map.zoom = self.map.zoom + 1;
        };*/

        // permalink

        /*
         TYPEAHEAD SEARCH
         */

        // Initialize the suggestion engine
        var placesSource = new Bloodhound({
            limit: 30,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: 'https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=%QUERY&type=locations',
                wildcard: '%QUERY',
                filter: function (locations) {
                    return locations.results;
                }
            }
        });
        placesSource.initialize();

        // load places into the typeahead directive
        this.places = {
            displayKey: function (location) {
                // let's remove some unwanted markup in the returned locations
                let returnLocation = location.attrs.label.replace('<b>', '').replace('</b>', '');
                returnLocation =  returnLocation.replace('<i>', '').replace('</i>', '');

                return returnLocation;
            },
            source: placesSource.ttAdapter()
        };

        // watch the home.search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function (value) {
            if (self.search !== null && typeof self.search === 'object') {

                // center result
                let coordinates = [self.search.attrs.lon, self.search.attrs.lat];
                let transformed = self.Map.transform(coordinates, true);

                self.Map.setPosition(transformed[0], transformed[1]);
            }
        });
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

    // Delete content in search box
    deleteSearchInput() {
      this.search = "";
    }
}
