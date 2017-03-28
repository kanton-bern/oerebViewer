export class LayersService {
    constructor(Notification) {
        'ngInject';

        this.ol = ol;
        this.Map = Map;
        this.Notification = Notification;

        this.layers = [];
        this.resolvedLayers = [];
        this.parser = new ol.format.WMTSCapabilities();

        // add layers
        this.add(this.asyncCantonLayer());
        this.add(this.asyncGrundbuchMapLayer());
        this.add(this.asyncGreyMapLayer());
        this.add(this.asyncOrthoPhotoLayer());
        this.add(this.oerebLayer());
    }

    /*
        LAYERS START
     */
    oerebLayer() {
        let wmsOEREBSource = new this.ol.source.TileWMS(({
            url: 'https://www.geoservice.apps.be.ch/geoservice1/services/a42pub1/a42pub_oereb_av_wms_d_bk/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF',
                'TILED': true,
                'VERSION': '1.3.0',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:2056'
            },
            serverType: 'geoserver'
        }));


        let wmsOEREB = new this.ol.layer.Tile({
            opacity: 1,
            visible: true,
            source: wmsOEREBSource,
            name: 'oereb'
        });

        wmsOEREB.setZIndex(100);

        return wmsOEREB;
    }


    asyncGreyMapLayer() {
        let self = this;

        return fetch('https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_hintergrund_grau_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_hintergrund_grau_n_bk',
                matrixSet: 'EPSG:2056'
            });

            let wmtsSource = new ol.source.WMTS(options);

            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: true,
                name: 'greyMap'
            });

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_hintergrund_grau_n_bk konnte nicht geladen werden.');
        });
    }

    asyncGrundbuchMapLayer() {
        let self = this;

        return fetch('/app/components/layers/capabilities/grundbuch.xml').then(function (response) {
                return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_mopube_n_bk',
                matrixSet: 'EPSG:2056'
            });

            let wmtsSource = new ol.source.WMTS(options);

            let wmtsLayer = new ol.layer.Tile({
                opacity: 0.5,
                source: wmtsSource,
                visible: true,
                name: 'grundbuchMap'
            });

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_mopube_n_bk konnte nicht geladen werden.');
        });
    }

    asyncCantonLayer() {
        let self = this;

        return fetch('https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_kanton5_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_kanton5_n_bk',
                matrixSet: 'EPSG:2056'
            });

            let wmtsSource = new ol.source.WMTS(options);

            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: true,
                name: 'cantonMap'
            });

            wmtsLayer.setZIndex(500);

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_hintergrund_grau_n_bk konnte nicht geladen werden.');
        });
    }

    asyncOrthoPhotoLayer() {
        let self = this;

        return fetch('https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_orthofoto_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_orthofoto_n_bk',
                matrixSet: 'EPSG:2056'
            });

            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS(options),
                visible: false,
                name: 'orthoPhoto'
            });

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_orthofoto_n_bk konnte nicht geladen werden.');
        });;
    }


    osmLayer() {
        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'orthoPhoto'
        });

        return osmLayer;
    }

    /*
        LAYERS END
     */



    // checks if layer is currently active
    isActive(name) {
        return (this.active == name);
    }

    // checks if layer is hidden
    isHidden(name) {
        for (let i = 0; i < this.resolvedLayers.length; i++) {
            if (this.resolvedLayers[i].M.name == name) {
                return !this.resolvedLayers[i].visible;
            }
        }
        return false;
    }

    // hide a layer by name
    hide(name, inverse = false) {
        for (let i = 0; i < this.resolvedLayers.length; i++) {
            if (this.resolvedLayers[i].M.name == name) {
                this.resolvedLayers[i].visible = inverse;
            }
        }

        return name;
    }

    // show a layer by name
    show(name) {
        return this.hide(name, true);
    }

    get(callback) {
        let layerService = this;

        let requests = this.layers.map((layer) => {
            return new Promise((resolve) => {
                if (layer instanceof Promise) {
                    layer.then(function (value) {
                        layerService.resolvedLayers.push(value);
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

    add(layer) {
        this.layers.push(layer);
    }
}


