export function MapDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        template: require('./map.html'),
        controller: MapController,
        controllerAs: 'map',
        bindToController: true
    };

    return directive;
}

class MapController {
    constructor(Config, Layers, $log, $state, $base64, $window, OEREB, WFS, Extracts, Map, Helpers, Coordinates, Notification, $filter, $scope) {
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
        this.$scope = $scope;

        this.currentEgrid = 0;

        this.activeLayer = this.Layers.defaultView();

        // adds observer for clicks on the map
        Map.registerClickObserver((coordinates, force = false) => {
            // close menu
            let menuStatus = this.Helpers.getMenuStatus();

            if (menuStatus) {
                this.Helpers.closeMenu();
            }

            // close map
            this.Map.closeSearch();

            if (!force && (this.Map.getView().getZoom() < this.Config.zoom.oerebLayer || menuStatus)) {
                return;
            }

            if (force) {
                this.Map.setZoom(this.Config.zoom.zoomedIn);
            }

            // creates an overlay over the openlayers api
            let popup = new Map.ol.Overlay({
                element: document.getElementById('infobox')
            });

            this.Map.lastOverlay = popup;

            // add the overlay 'popup' to the map
            Map.addOverlay(popup);

            $('#object-information').hide();

            let element = popup.getElement();

            $(element).hide();
            $(element).show();

            popup.setPosition(coordinates[2056]);

            this.selectedPoint = [];
            this.infoboxLoading = true;
            this.OEREB.getEGRID(coordinates).then(
                (d) => {
                    this.selectedPoint = d.data || [];
                    this.infoboxLoading = false;
                },
                (data) => {
                    this.Notification.error(
                        this.$filter('translate')('notification_nodata')
                    );
                }
            );

            this.WFS.getSource(coordinates).then((vectorSource) => {
                this.drawByWFSSource(vectorSource, 'clicked');
            });

        });

        Extracts.registerCurrentObserverCallback((reloading) => {

            this.currentEgrid = this.Extracts.getCurrent().egrid;

            if (!reloading) {
                this.centerObject();
            }
        });

        Map.registerCenterObjectCallback(this.$scope, () => {
            this.centerObject();
        });

        // load map
        this.map = Map.map;
    }

    drawByWFSSource(source, addLayerMethod) {
        if (addLayerMethod == 'clicked') {
            this.Map.addClickedLayer(source);
        }

        if (addLayerMethod == 'selected') {
            this.Map.addSelectedLayer(source);
        }
    }

    geolocate() {
        let self = this;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    let coordinates = self.Coordinates.create(self.Coordinates.System[4326], [position.coords.longitude, position.coords.latitude]);

                    self.Map.setPosition(coordinates);

                    setTimeout(function () {
                        let currentCenter = self.Map.getCenter();
                        self.Map.click(currentCenter, true);
                    }, 1000);

                    self.Helpers.closeMenu();
                },
                function errorCallback(error) {

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            self.Notification.error(self.$filter('translate')('notification_geolocation_permission'));
                            break;
                        case error.POSITION_UNAVAILABLE:
                            self.Notification.error(self.$filter('translate')('notification_geolocation_coordinates'));
                            break;
                        default:
                            self.Notification.error(self.$filter('translate')('notification_geolocation_unknown'));
                            break;
                    }
                },
                {
                    maximumAge: Infinity,
                    timeout: 5000
                }
            );
        } else {
            self.Notification.error(self.$filter('translate')('notification_geolocation_browser'));
        }
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
        if (angular.isDefined(this.Map.lastOverlay)) {
            return this.Map.removeOverlay(this.Map.lastOverlay);
        }
        return false;

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    showOverlay() {
        if (angular.isDefined(this.Map.lastOverlay)) {
            return this.Map.addOverlay(this.Map.lastOverlay);
        }

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    zoomOut() {
        this.Map.zoomOut();

        // Close main menu if open
        this.Helpers.closeMenu();
    }

    setView(name) {
        this.activeLayer = name;
        this.Layers.setView(name);
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

    showDetail(egrid) {
        this.Helpers.openMenu();
        this.Map.hideOverlay();
        this.Map.removeClickedLayer();
    }

    centerObject() {
        if (this.currentEgrid) {
            this.WFS.getSource(this.currentEgrid).then((vectorSource) => {
                this.drawByWFSSource(vectorSource, 'selected');
                this.Map.getView().fit(vectorSource.getExtent(), (this.Map.getSize()));
            });
        }
    }
}
