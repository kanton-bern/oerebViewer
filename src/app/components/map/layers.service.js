export class LayersService {
    constructor() {
        'ngInject';

        this.ol = ol;
        this.Map = Map;

        this.activeLayerNames = ['ortho'];

        this.layers = [];
        this.resolvedLayers = [];
        this.parser = new ol.format.WMTSCapabilities();

        this.resolutions = [
            4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
            1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
        ];

        this.resolutions = [
            500, 1000, 2000, 3000, 5000, 6000, 7500, 12000
        ];

        var extent = [2420000, 130000, 2900000, 1350000];
        var projection = ol.proj.get('EPSG:2056');
        projection.setExtent(extent);

        var matrixIds = [];
        for (var i = 0; i < this.resolutions.length; i++) {
            matrixIds.push(i);
        }

        // addLayers
        this.add(this.asyncOrthoLayer());
        this.add(this.asyncAerialLayer());
    }

    asyncOrthoLayer() {
        let self = this;

        return fetch('/app/components/map/capabilities/orthoWMTS.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            var result = self.parser.read(text);
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_hintergrund_grau_n_bk',
                matrixSet: 'EPSG:2056'
            });

            var wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS(options),
                visible: false,
                name: 'ortho'
            });

            return wmtsLayer;
        });
    }

    asyncAerialLayer() {
        let self = this;

        return fetch('/app/components/map/capabilities/aerialWMTS.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            var result = self.parser.read(text);
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_orthofoto_n_bk',
                matrixSet: 'EPSG:2056'
            });

            var wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS(options),
                visible: true,
                name: 'aerial'
            });

            return wmtsLayer;
        });
    }


    osmLayer() {
        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'ortho'
        });

        return osmLayer;
    }

    isActive(name) {
        /*for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].M.name == name) {
                return this.layers[i].visible;
            }
        }

        return false;*/

        console.log('isactive');

        console.log(this.activeLayerNames);

        console.log(name);
        console.log(this.activeLayerNames.includes(name));
        return (this.active == name);
    }

    hide(name, inverse = false) {
        for (var i = 0; i < this.resolvedLayers.length; i++) {
            if (this.resolvedLayers[i].M.name == name) {
                this.resolvedLayers[i].visible = inverse;
            }
        }

        return name;
    }

    show(name) {
        return this.hide(name, true);
    }


    get(callback) {
        var layerService = this;

        let requests = this.layers.map((layer) => {
            return new Promise((resolve) => {
                if (layer instanceof Promise) {
                    layer.then(function (value) {
                        layerService.resolvedLayers.push(value);
                        console.log('resolved');
                        resolve();
                    });
                } else {
                    layerService.resolvedLayers.push(layers)
                    resolve();
                }

            });
        })

        Promise.all(requests).then(() => callback(layerService.resolvedLayers));
    }

    /*
     only works before map initialization, after that use Map.addTempLayer()
     */
    add(layer) {
        this.layers.push(layer);
    }
}


