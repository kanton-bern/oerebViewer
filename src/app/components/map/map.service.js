export class MapService {
    constructor(ngeoDecorateLayer, Layers, Oereb) {
        'ngInject';

        let self = this;
        this.ol = ol;
        this.Oereb = Oereb;
        this.Layers = Layers;

        this.tempLayers = [];
        this.clickObservers = [];
        this.modeChangedObservers = [];

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
            // Close main menu if open
            if (angular.element("#menuLeftSlider").attr('aria-expanded') == 'true') {
              angular.element('#buttonShowExtract').click();
            }

            self.onClickOnMap(event);
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

    setPosition(lat, lon, zoom = this.config.zoom.zoomedIn) {
        this.map.getView().setCenter([
            parseFloat(lat),
            parseFloat(lon)
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

    notifyClickObservers(event) {
        angular.forEach(this.clickObservers, function (callback) {
            callback(event);
        });
    }

    onClickOnMap(event) {
        this.notifyClickObservers(event);
    }

    transform(coordinate, inverse = false) {
        // source
        var epsg21781 = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';

        // target
        var epsg4326 = '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees';

        if (inverse)
            return proj4(epsg4326,epsg21781,coordinate);

        return proj4(epsg21781,epsg4326,coordinate);
    }

    transformFrom2056(coordinate, inverse = false) {
        // source
        var epsg2056 = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';
        // target
        var epsg21781 = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';

        if (inverse)
            return proj4(epsg21781,epsg2056,coordinate);

        return proj4(epsg2056,epsg21781,coordinate);
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
