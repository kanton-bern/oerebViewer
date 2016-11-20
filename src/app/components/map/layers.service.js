export class LayersService {
    constructor() {
        'ngInject';

        this.ol = ol;
        this.Map = Map;

        this.layers = [];
        this.resolvedLayers = [];
        this.parser = new ol.format.WMTSCapabilities();

        // add layers
        this.add(this.asyncGreyMapLayer());
        this.add(this.asyncOrthoPhotoLayer());
        this.add(this.oerebLayer());
        // this.add(this.osmLayer());
    }

    oerebLayer() {
        let wmsOerebSource = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice1/services/a42pub1/a42pub_oereb_av_wms_d_bk/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE',  // LAYERS=GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE
                'TILED': true,
                'VERSION': '1.3.0',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:21781'
            },
            serverType: 'geoserver'
        }));


        let wmsOEREB = new this.ol.layer.Tile({
            visible: true,
            source: wmsOerebSource,
            name: 'oereb'
        });

        wmsOEREB.setZIndex(100);

        return wmsOEREB;
    }

    asyncGreyMapLayer() {
        let self = this;

        return fetch('/app/components/map/capabilities/greyMapWMTS.xml').then(function (response) {
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
                visible: true,
                name: 'greyMap'
            });

            return wmtsLayer;
        });
    }

    asyncOrthoPhotoLayer() {
        let self = this;

        return fetch('/app/components/map/capabilities/orthoPhotoWMTS.xml').then(function (response) {
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
                visible: false,
                name: 'orthoPhoto'
            });

            return wmtsLayer;
        });
    }


    osmLayer() {
        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'orthoPhoto'
        });

        return osmLayer;
    }

    isActive(name) {
        return (this.active == name);
    }

    isHidden(name) {
        for (var i = 0; i < this.resolvedLayers.length; i++) {
            if (this.resolvedLayers[i].M.name == name) {
                return !this.resolvedLayers[i].visible;
            }
        }
        return false;
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
                    layerService.resolvedLayers.push(layer);
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


