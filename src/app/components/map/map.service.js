export class MapService {
    constructor(ngeoDecorateLayer, Layers, Oereb, Helpers, Coordinates) {
        'ngInject';

        let self = this;
        this.ol = ol;
        this.Oereb = Oereb;
        this.Layers = Layers;
        this.Coordinates = Coordinates;
        this.Helpers = Helpers;

        this.tempLayers = [];
        this.clickObservers = [];
        this.modeChangedObservers = [];

        this.isSearchOpen = false;

        this.config = {
            zoom: {

                default: 4,
                zoomedIn: 13
            },
            projection: {
                extent: [420000, 30000, 900000, 350000],
                epsg: 'EPSG:21781',
            }
        }

        this.center = [599042.5342280008,185035.77279221092];
        this.zoom = this.config.zoom.default;

        Layers.get().forEach(function (layer) {
            ngeoDecorateLayer(layer);
        });

        // projection
        this.projection = this.ol.proj.get(self.config.projection.epsg);

        // view
        this.view = new this.ol.View({
            center: self.center,
            zoom: self.zoom,
            projection: this.projection
        });

        this.map = new this.ol.Map({
            layers: Layers.get(),
            view: this.view
        });


        var shouldUpdate = true;
        var view = this.map.getView();
        var onResizeMap = function () {

            if (view.getZoom() > 11) {
                self.Layers.show('oereb');
            } else {
                self.Layers.hide('oereb');
            }

            console.log(view.getZoom() + ' ' + view.getCenter());

            return true;

            if (!shouldUpdate) {
                // do not update the URL when the view was changed in the 'popstate' handler
                shouldUpdate = true;
                return;
            }

            var center = view.getCenter();

            // generate hash
            var hash = '/#/?' +
                $base64.encode(
                    view.getZoom() + '/' + center[0] + '/' + center[1]
                ).slice(0, -1);

            var state = {
                zoom: view.getZoom(),
                center: view.getCenter()
            };
            window.history.pushState(state, 'map', hash);
        };

        this.map.on('moveend', onResizeMap);

        // onload set center from url
        window.addEventListener('popstate', function (event) {
            if (event.state === null) {
                return;
            }
            self.map.getView().setCenter(event.state.center);
            self.map.getView().setZoom(event.state.zoom);
            shouldUpdate = false;
        });

        // click event listener
        this.map.on('singleclick', function (event) {
            var coordinates = self.Coordinates.set('lastClick', Coordinates.System[21781], event.coordinate);
            self.notifyClickObservers(coordinates);
        });

        var positionFeatureStyle = new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 6,
                fill: new this.ol.style.Fill({color: 'rgba(230, 100, 100, 1)'}),
                stroke: new this.ol.style.Stroke({color: 'rgba(230, 40, 40, 1)', width: 2})
            })
        });

        var accuracyFeatureStyle = new this.ol.style.Style({
            fill: new this.ol.style.Fill({color: 'rgba(100, 100, 230, 0.3)'}),
            stroke: new this.ol.style.Stroke({color: 'rgba(40, 40, 230, 1)', width: 2})
        });

        this.mobileGeolocationOptions = {
            positionFeatureStyle: positionFeatureStyle,
            accuracyFeatureStyle: accuracyFeatureStyle,
            zoom: this.config.zoom.zoomedIn,
        };
    }

    click(coordinates) {
        this.notifyClickObservers(coordinates);
    }

    openSearch() {
        this.Helpers.closeMenu(); 

        this.isSearchOpen = true;

        setTimeout(function() {
            $('#search-me').trigger('focus')
        }, 100);

        return this.isSearchOpen;
    }

    closeSearch() {
        this.isSearchOpen = false;
        return this.isSearchOpen;
    }

    toggleSearch() {
        if (this.isSearchOpen)
            return this.closeSearch();

        return this.openSearch();
    }

    setPosition(coordinates, zoom = this.config.zoom.zoomedIn) {
        this.map.getView().setCenter([
            parseFloat(coordinates[21781][0]),
            parseFloat(coordinates[21781][1])
        ]);

        this.map.getView().setZoom(zoom);
    }

    setZoom(zoom) {
        this.map.getView().setZoom(zoom);
    }

    addOverlay(overlay) {
        this.map.addOverlay(overlay);
    }

    removeOverlay(overlay) {
        this.map.removeOverlay(overlay);
    }

    zoomIn() {
        let self = this;
        self.map.getView().setZoom(self.map.getView().getZoom()+1);
    }

    zoomOut() {
        let self = this;
        self.map.getView().setZoom(self.map.getView().getZoom()-1);
    }

    getZoom() {
        return self.map.getZoom();
    }

    registerClickObserver(callback) {
        this.clickObservers.push(callback);
    }

    notifyClickObservers(coordinates) {
        // Close main menu if open
        if (angular.element("#menuLeftSlider").attr('aria-expanded') == 'true') {
            angular.element('#buttonShowExtract').click();
        }

        angular.forEach(this.clickObservers, function (callback) {
            callback(coordinates);
        });
    }

    /*
     Adds Temporary Layers. Everytime new temporary Layers are added. The old one gets removed.
     */
    addTempLayers(layers) {
        let self = this;

        // remove old temp layers
        angular.forEach(self.tempLayers, function(layer) {
            self.map.removeLayer(layer);
        });

        // clean array
        self.tempLayers = [];

        // add new temp layers
        angular.forEach(layers, function(layer) {
            // saves layer, so we can remove them again
            self.tempLayers.push(layer);
            self.map.addLayer(layer);
        });
    }

    get() {
        return this.map;
    }

    getView() {
        return this.map.getView();
    }
}
