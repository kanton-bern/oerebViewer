export class LayersService {
    constructor(Notification, EsriToken) {
        'ngInject';

        this.ol = ol;
        this.Map = Map;
        this.Notification = Notification;
        this.EsriToken = EsriToken;

        this.layers = [];
        this.resolvedLayers = [];
        this.parser = new ol.format.WMTSCapabilities();

        /*
         * REGISTER LAYERS HERE
        */

        // Geometrie der Kantonsgrenze
        this.add(this.asyncCantonLayer());

        // Grundbuchplan schwarz-weiss
        this.add(this.asyncGrundbuchMapLayer());

        // Grauer Hintergrund für kleine Masstäbe (ergänzend zum Grundbuchplan)
        this.add(this.asyncGreyMapLayer());

        // Orthophoto für zweite Hintergrundansicht
        this.add(this.asyncOrthoPhotoLayer());

        // Enthält die Umrisse der Grundstücke und selbständigen und dauernden Rechte wird dem Hintergrund überlagert
        this.add(this.oerebLayer());
    }

    /*
        Views definitions:
     */

    defaultView() {
        return 'map';
    }

    setView(name) {
        if (name === 'map') {
            this.show('greyMap'); // layer name
            this.hide('orthoPhoto');
        }

        if (name === 'satellite') {
            this.show('orthoPhoto');
            this.hide('greyMap');
        }
    }

    /*
        Layer-Methods needs to return an instance of ol.layer.Tile or a Promise that will be resolved with an instance of ol.layer.Tile
        The layers need to be registered within the constructor like so: this.add(this.layerMethod());
     */

    /*
     Implementation of a WMS
     */
    exampleWMSWithEsri() {
        let configuration = {
            url: 'https://www.geoservice2-test.apps.be.ch/geoservice2/services/a4p/a4p_hintergrund_grau_n_bk_testmb/MapServer/WMSServer?',
            token: this.EsriToken.register('a4p_grau', {
                endpoint: 'https://www.geoservice2-test.apps.be.ch/geoservice2/tokens/generateToken',
                username: 'a4p_testmb_user',
                password: 'a4p_testmb_user',
            }),
        };

        return this.waitForToken(configuration.token).then((access_token) => {
            // documentation for ol.source.TileWMS: http://geoadmin.github.io/ol3/apidoc/ol.source.TileWMS.html
            let params = {
                'LAYERS': 'GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF',
                'TILED': true,
                'VERSION': '1.3.0',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:2056'
            };

            if (access_token) {
                params.token = access_token;
            }

            let wmsOEREBSource = new this.ol.source.TileWMS(({
                url: configuration.url,
                params: params,
                serverType: 'geoserver',
            }));

            if (configuration.token) {
                configuration.token.onUpdate(function (token) {
                    params.token = token;
                    wmsOEREBSource.updateParams({token: token});
                });
            }

            // http://geoadmin.github.io/ol3/apidoc/ol.layer.Tile.html
            let wmsOEREB = new this.ol.layer.Tile({
                opacity: 1,
                visible: true, // is visible per default
                source: wmsOEREBSource,
            });

            wmsOEREB.setZIndex(100);

            return wmsOEREB;
        });
    }

    /*
     Implementation of a WMS
     */
    oerebLayer() {
        let configuration = {
            url: 'https://www.geoservice.apps.be.ch/geoservice1/services/a42pub1/a42pub_oereb_av_wms_d_bk/MapServer/WMSServer?',
        };

        // documentation for ol.source.TileWMS: http://geoadmin.github.io/ol3/apidoc/ol.source.TileWMS.html
        let params = {
            'LAYERS': 'GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF',
            'TILED': true,
            'VERSION': '1.3.0',
            'FORMAT': 'image/png',
            'CRS': 'EPSG:2056'
        };

        let wmsOEREBSource = new this.ol.source.TileWMS(({
            url: configuration.url,
            params: params,
            serverType: 'geoserver',
        }));

        // http://geoadmin.github.io/ol3/apidoc/ol.layer.Tile.html
        let wmsOEREB = new this.ol.layer.Tile({
            opacity: 1,
            visible: true, // is visible per default
            source: wmsOEREBSource,
            name: 'oereb' // the name is necessary for interacting with this layer, see setView method
        });

        wmsOEREB.setZIndex(100);

        return wmsOEREB;
    }

    /*
        Implementation of a WMTS - based on a Capabilites.xml
     */
    asyncGreyMapLayer() {
        let self = this;

        // fetches capabilities from a service
        return fetch('https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_hintergrund_grau_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(function (response) {
            return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);

            // parses options based on the capabilities
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_hintergrund_grau_n_bk',
                matrixSet: 'EPSG:2056'
            });

            // http://geoadmin.github.io/ol3/apidoc/ol.source.WMTS.html
            let wmtsSource = new ol.source.WMTS(options);

            // creates ol.layer.Tile with the prepared source
            return new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: true, // is visible per default
                name: 'greyMap' // the name is necessary for interacting with this layer, see setView method
            });

        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_hintergrund_grau_n_bk konnte nicht geladen werden.'); // warning if not accessible
        });
    }

    /*
     Implementation of a WMTS - based on a Capabilites.xml
     */
    asyncGrundbuchMapLayer() {
        let self = this;

        // fetches capabilities from a service
        return fetch('https://www.geoservice.apps.be.ch/geoservice1/rest/services/a4p/a4p_mopube_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml').then(function (response) {
                return response.text();
        }).then(function (text) {
            let result = self.parser.read(text);

            // parses options based on the capabilities
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_mopube_n_bk',
                matrixSet: 'EPSG:2056'
            });

            // http://geoadmin.github.io/ol3/apidoc/ol.source.WMTS.html
            let wmtsSource = new ol.source.WMTS(options);

            // creates ol.layer.Tile with the prepared source
            let wmtsLayer = new ol.layer.Tile({
                opacity: 0.5,
                source: wmtsSource,
                visible: true, // is visible per default
                name: 'grundbuchMap' // the name is necessary for interacting with this layer, see setView method
            });

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_mopube_n_bk konnte nicht geladen werden.');
        });
    }


    /*
     Implementation of a WMTS - based on a Capabilites.xml
     */
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

    /*
     Implementation of a WMTS - based on a Capabilites.xml
     */
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


    /*
        Implementation of OSM: http://geoadmin.github.io/ol3/apidoc/ol.source.OSM.html
     */
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

    /*
        DO NOT EDIT CODE AFTER THIS COMMENT
     */

    // checks if layer is currently active
    isActive(name) {
        return (this.active == name);
    }

    // hide a layer by name
    hide(name, inverse = false) {
        this.resolvedLayers.forEach(layer => {
            if (layer !== undefined && layer.M && layer.M.name == name) {
                layer.visible = inverse;
            }
        });

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
                        if (value !== undefined)
                            layerService.resolvedLayers.push(value);

                        resolve();
                    });
                } else {
                    layerService.resolvedLayers.push(layer);
                    resolve();
                }

            });
        });

        Promise.all(requests).then(() => callback(layerService.resolvedLayers));
    }

    add(layer) {
        this.layers.push(layer);
    }

    /**
     * wait for token to be fetched
     * @param {EsriToken} token
     * @returns {Promise}
     */
    waitForToken(token) {
        if (token) {
            return new Promise(function (resolve, reject) {
                token.onUpdateOnce(resolve)
            })
        }

        return Promise.resolve();
    }
}


