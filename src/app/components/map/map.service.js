const MAP_CENTER_OBJECT_EVENT = 'map-center-object-event';

export class MapService {
    constructor(ngeoDecorateLayer, Config, Layers, Helpers, Coordinates, $window, $rootScope) {
        'ngInject';

        // declarations
        let self = this;
        this.ol = ol;
        this.Layers = Layers;
        this.Coordinates = Coordinates;
        this.Helpers = Helpers;
        this.$rootScope = $rootScope;

        // default definitions
        this.tempLayers = [];
        this.selectedLayer = undefined;
        this.clickedLayer = undefined;
        this.clickObservers = [];

        this.isSearchOpen = false;

        this.Config = Config;

        // current center
        this.center = this.Config.center;

        // default zoom by config
        this.zoom = this.Config.zoom.default;

        // set projection by config
        this.projection = this.ol.proj.get(this.Config.projection.epsg);

        // correct zoom
        let zoom = this.Config.zoom.min;
        if ($window.innerWidth < 1200) zoom = this.Config.zoom.minTablet;
        if ($window.innerWidth < 480) zoom = this.Config.zoom.minMobile;

        // initialises view
        this.view = new this.ol.View({
            center: self.center,
            extent: this.Config.projection.extent,
            zoom: self.zoom,
            projection: this.projection,
            minZoom: zoom
        });

        // deactivates drag rotation interactions
        let interactions = this.ol.interaction.defaults({
            altShiftDragRotate: false,
            pinchRotate: false
        });

        // initialises map
        this.map = new this.ol.Map({
            view: this.view,
            interactions: interactions
        });

        // registers 'moveend' event listener
        this.map.on('moveend', function () {
            self.updateStatus();
        });

        // workaround for oereb layer early load
        setTimeout(function () {
            self.updateStatus();
        }, 500);

        // registers 'singleclick' event listener
        this.map.on('singleclick', function (event) {
            let coordinates = self.Coordinates.set('lastClick', Coordinates.System[2056], event.coordinate);
            self.notifyClickObservers(coordinates);
        });

        let positionFeatureStyle = new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 6,
                fill: new this.ol.style.Fill({color: 'rgba(230, 100, 100, 0)'}),
                stroke: new this.ol.style.Stroke({color: 'rgba(230, 40, 40, 1)', width: 2})
            })
        });

        let accuracyFeatureStyle = new this.ol.style.Style({
            fill: new this.ol.style.Fill({color: 'rgba(100, 100, 230, 0.3)'}),
            stroke: new this.ol.style.Stroke({color: 'rgba(40, 40, 230, 1)', width: 2})
        });

        // adds layers to map
        Layers.get(function(layers) {
            layers.forEach(function(layer) {
                if (layer !== undefined) {
                    ngeoDecorateLayer(layer);
                    self.map.addLayer(layer);
                }
            });
        });
    }

    updateStatus() {
        let self = this;
        let view = this.map.getView();

        if (view.getZoom() >= this.Config.zoom.oerebLayer) {
            self.Layers.show('oereb');
        } else {
            self.Layers.hide('oereb');
        }
    }

    click(coordinates, force = false) {
        this.notifyClickObservers(coordinates, force);
    }

    getCenter() {
        let center = this.map.getView().getCenter();
        return this.Coordinates.create(this.Coordinates.System[2056], [center[0], center[1]]);
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

    setPosition(coordinates, zoom = this.Config.zoom.zoomedIn) {
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

    notifyClickObservers(coordinates, force = false) {

        // Close main menu if open
        if (angular.element("#menuLeftSlider").attr('aria-expanded') === 'true') {
            angular.element('#buttonShowExtract').click();
        }

        angular.forEach(this.clickObservers, function (callback) {
            callback(coordinates, force);
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

    addSelectedLayer(vectorSource) {
        // Create vector layer attached to the vector source.
        let vectorLayer = new self.ol.layer.Vector({
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

        this.addLayer(vectorLayer);

        this.click(this.getCenter());
    }

    addClickedLayer(vectorSource) {
        let self = this;

        let vectorLayer = new self.ol.layer.Vector({
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

    registerCenterObjectCallback(scope, callback){
        var deregister = this.$rootScope.$on(MAP_CENTER_OBJECT_EVENT, callback);
        scope.$on('$destroy', deregister);
    }

    /**
     * delegate to subscribed maps directives
     */
    centerObject(){
        this.$rootScope.$broadcast(MAP_CENTER_OBJECT_EVENT);
    }
}
