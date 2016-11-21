export class MapService {
    constructor(ngeoDecorateLayer, Layers, Oereb, Helpers, Coordinates) {
        'ngInject';

        // declarations
        let self = this;
        this.ol = ol;
        this.Oereb = Oereb;
        this.Layers = Layers;
        this.Coordinates = Coordinates;
        this.Helpers = Helpers;

        // default definitions
        this.tempLayers = [];
        this.selectedLayer = undefined;
        this.clickedLayer = undefined;
        this.clickObservers = [];
        this.modeChangedObservers = [];

        this.shouldUpdate = true;
        this.isSearchOpen = false;

        // configs for map
        this.config = {
            zoom: {
                default: 4,
                zoomedIn: 13
            },
            projection: {
                // extent: [420000, 30000, 900000, 350000],  // 2440000
                // epsg: 'EPSG:21781',
                epsg: 'EPSG:2056'
            }
        };

        // current center
        this.center = [620039.0625,188203.125];

        // default zoom by config
        this.zoom = this.config.zoom.default;

        // set projection by config
        this.projection = this.ol.proj.get(self.config.projection.epsg);

        // initialises view
        this.view = new this.ol.View({
            // center: self.center,
            zoom: self.zoom,
            projection: this.projection,
            minZoom: 4
        });

        // initialises map
        this.map = new this.ol.Map({
            view: this.view,
        });

        // registers 'moveend' event listener
        this.map.on('moveend', function () {
            self.updateStatus();
        });

        // registers 'singleclick' event listener
        this.map.on('singleclick', function (event) {
            var coordinates = self.Coordinates.set('lastClick', Coordinates.System[2056], event.coordinate);
            self.notifyClickObservers(coordinates);
        });

        var positionFeatureStyle = new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 6,
                fill: new this.ol.style.Fill({color: 'rgba(230, 100, 100, 0)'}),
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

        // adds layers to map
        Layers.get(function(layers) {
            layers.forEach(function(layer) {
                ngeoDecorateLayer(layer);
                self.map.addLayer(layer);
            });
        });
    }

    updateStatus() {
        var self = this;
        var view = this.map.getView();

        if (view.getZoom() > 10) {
            self.Layers.show('oereb');
        } else {
            self.Layers.hide('oereb');
        }
    }

    click(coordinates) {
        this.notifyClickObservers(coordinates);
    }


    openSearch() {
        this.Helpers.closeMenu();

        this.isSearchOpen = true;

        setTimeout(function() {
            // $('#search-me').trigger('focus');
            document.querySelector('[id="search-me"]').focus();
        }, 200);

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
            parseFloat(coordinates[2056][0]),
            parseFloat(coordinates[2056][1])
        ]);

        this.map.getView().setZoom(zoom);
    }

    setZoom(zoom) {
        this.map.getView().setZoom(zoom);
    }

    addOverlay(overlay) {
        this.map.addOverlay(overlay);
    }

    hideOverlay(overlay) {
        $('.infobox').hide();
    }

    removeOverlay(overlay) {
        if (angular.isDefined(overlay)) {
            this.map.removeOverlay(overlay);
            return;
        }

        if (angular.isDefined(this.lastOverlay)) {
            this.map.removeOverlay(this.lastOverlay);
            return;
        }

        console.debug('tried to remove an non existing overlay');
        return;

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
            self.addLayer(layer);
        });
    }

    createPolygon(posList) {
        var self = this;

        var ring = [];

        for (var i = 0; i < posList.length; i=i+2) {
            var temporary = self.Coordinates.create(self.Coordinates.System[2056], [posList[i], posList[i+1]]);
            ring.push([temporary[21781][0], temporary[21781][1]]);
        }

        return new self.ol.geom.Polygon([ring]);
    }

    addSelectedLayer(vectorSource) {
        // Create vector layer attached to the vector source.
        var vectorLayer = new self.ol.layer.Vector({
            source: vectorSource,
            style: new self.ol.style.Style({
                stroke: new self.ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 1.0)',
                    width: 2
                }),
                fill: new self.ol.style.Fill({
                    color: 'rgba(255, 0, 0, 0)',
                })
            })
        });

        vectorLayer.setZIndex(5000);

        if (angular.isDefined(this.selectedLayer))
            this.map.removeLayer(this.selectedLayer);

        this.selectedLayer = vectorLayer;

        this.addLayer(vectorLayer)
    }

    addClickedLayer(vectorSource) {
        var self = this;

        var vectorLayer = new self.ol.layer.Vector({
            source: vectorSource,
            style: new self.ol.style.Style({
                stroke: new self.ol.style.Stroke({
                    color: 'rgba(255, 100, 0, 0.9)',
                    width: 2
                }),
                fill: new self.ol.style.Fill({
                    color: 'rgba(255, 100, 0, 0.2)',
                })
            })
        });

        vectorLayer.setZIndex(5000);

        if (this.clickedLayer != undefined)
            this.map.removeLayer(this.clickedLayer);

        this.clickedLayer = vectorLayer;

        this.addLayer(vectorLayer)
    }

    removeClickedLayer() {
        if (angular.isDefined(this.clickedLayer))
            this.map.removeLayer(this.clickedLayer);
    }


    addLayer(layer) {
        this.map.addLayer(layer);
    }

    get() {
        return this.map;
    }

    getView() {
        return this.map.getView();
    }

    getSize() {
        return this.map.getSize();
    }
}
