export class LayersService {
    constructor(Notification, EsriToken) {
        'ngInject';

        this.ol = ol;
        this.Notification = Notification;
        this.EsriToken = EsriToken;

        this.layers = [];
        this.resolvedLayers = [];
        this.parser = new ol.format.WMTSCapabilities();

        this.globalTokenForWMTS = null;

        /*
         * Global token can be used by WMTS layers as a general configuration
         */
        this.globalTokenForWMTS = this.EsriToken.register('a4p_global', {
            endpoint: 'https://www.geoservice.apps.be.ch/geoservice2/tokens/generateToken',
            username: process.env.TOKEN_USERNAME,
            password: process.env.TOKEN_PASSWORD,
            interval: 59, // token for 59min
        });

        /*
         * REGISTER LAYERS HERE
        */

        // Geometrie der Kantonsgrenze
        this.add(this.asyncCantonLayer());

        // Grundbuchplan schwarz-weiss
        this.add(this.asyncGrundbuchMapLayer());

        // Orthophoto für zweite Hintergrundansicht
        this.add(this.asyncOrthoPhotoLayer());
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
     Implementation of a WMTS - based on a Capabilites.xml
     */
    asyncCantonLayer() {
        let self = this;
        let configuration = {
            url: 'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_kanton5_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
            token: this.globalTokenForWMTS,
        };

        return this.waitForToken(configuration.token).then(function () {
            return fetch(configuration.url + '?token=' + configuration.token.token).then(function (response) {
                return response.text();
            })
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_kanton5_n_bk',
                matrixSet: 'EPSG:2056'
            });
            self.applyTokeToWMTSOptions(configuration.token, options);

            let wmtsSource = new ol.source.WMTS(options);
            self.refreshOnInvalidToken(configuration.token, wmtsSource);

            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: true,
                name: 'cantonMap'
            });

            wmtsLayer.setZIndex(500);

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_kanton5_n_bk konnte nicht geladen werden.');
        });
    }


    /*
     Implementation of a WMTS - based on a Capabilites.xml
     */
    asyncGrundbuchMapLayer() {
        let self = this;
        let configuration = {
            url: 'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_mopube_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
            token: this.globalTokenForWMTS,
        };

        // fetches capabilities from a service
        return this.waitForToken(configuration.token).then(function () {
            return fetch(configuration.url + '?token=' + configuration.token.token).then(function (response) {
                return response.text();
            })
        }).then(function (text) {
            let result = self.parser.read(text);

            // parses options based on the capabilities
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_mopube_n_bk',
                matrixSet: 'EPSG:2056'
            });
            self.applyTokeToWMTSOptions(configuration.token, options);

            // http://geoadmin.github.io/ol3/apidoc/ol.source.WMTS.html
            let wmtsSource = new ol.source.WMTS(options);
            self.refreshOnInvalidToken(configuration.token, wmtsSource);

            // creates ol.layer.Tile with the prepared source
            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: true, // is visible per default
                name: 'grundbuchMap' // the name is necessary for interacting with this layer, see setView method
            });

            wmtsLayer.setZIndex(2);

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_mopube_n_bk konnte nicht geladen werden.');
        });
    }

    /*
     Implementation of a WMTS - based on a Capabilites.xml
     */
    asyncOrthoPhotoLayer() {
        let self = this;
        let configuration = {
            url: 'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_orthofoto_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
            token: this.globalTokenForWMTS,
        };

        return this.waitForToken(configuration.token).then(function () {
            return fetch(configuration.url + '?token=' + configuration.token.token).then(function (response) {
                return response.text();
            })
        }).then(function (text) {
            let result = self.parser.read(text);
            let options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: 'a4p_a4p_orthofoto_n_bk',
                matrixSet: 'EPSG:2056'
            });
            self.applyTokeToWMTSOptions(configuration.token, options);

            let wmtsSource = new ol.source.WMTS(options);
            self.refreshOnInvalidToken(configuration.token, wmtsSource);

            let wmtsLayer = new ol.layer.Tile({
                opacity: 1,
                source: wmtsSource,
                visible: false,
                name: 'orthoPhoto'
            });

            wmtsLayer.setZIndex(3);

            return wmtsLayer;
        }).catch(function(ex) {
            self.Notification.warning('a4p_a4p_orthofoto_n_bk konnte nicht geladen werden.');
        });
    }

    /*
    Example Implementation of a WMS
   */
    exampleWMSWithEsri() {
        let configuration = {
            url: 'https://www.geoservice2-test.apps.be.ch/geoservice2/services/a4p/a4p_hintergrund_grau_n_bk_testmb/MapServer/WMSServer?',
            token: this.EsriToken.register('a4p_grau', {
                endpoint: 'https://www.geoservice2-test.apps.be.ch/geoservice2/tokens/generateToken',
                username: 'example_login',
                password: 'example_password',
            }),
        };

        return this.waitForToken(configuration.token).then((access_token) => {
            // documentation for ol.source.TileWMS: http://geoadmin.github.io/ol3/apidoc/ol.source.TileWMS.html
            let params = {
                'LAYERS': '0,1,2,3,4,5,6,7,8,9,10,11,12', // list of layers: https://www.geoservice2-test.apps.be.ch/geoservice2/rest/services/a4p/a4p_hintergrund_grau_n_bk/MapServer/layers
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

            wmsOEREB.setZIndex(1);

            return wmsOEREB;
        });
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
        if (token && !token.lastUpdate) {
            return new Promise(function (resolve, reject) {
                token.onUpdateOnce(resolve)
            })
        }

        return Promise.resolve();
    }

    /**
     * configure urls to contain esri token
     *
     * @param {EsriToken} token
     * @param {olx.source.WMTSOptions} options
     */
    applyTokeToWMTSOptions(token, options) {
        if (!token) return;

        for (let i = 0; i < options.urls.length; i++) {
            options.urls[i] += 'token=' + token.token;
        }

        // if token is expired, do hard reload
        token.onUpdate(() => {
            window.location.reload();
        });
    }

    /**
     * listen for errors and triggers a hard reload
     *
     * @param {EsriToken} token
     * @param {ol.source.WMTS} source
     */
    refreshOnInvalidToken(token, source) {
        if (!token) return;

        let threshold = 10;
        let errCount = 0;

        source.on('tileloaderror', function (err) {
            // after min 10 sec
            if (token.token && token.sinceUpdate() > 10000) {
                if (errCount++ === threshold || errCount > threshold + 50) {
                    // check if url is valid
                    fetch(err.tile.j) // FIXME (hacky) this depends on the current openlayers build
                        .then((response) => {
                            if (response.status === 498 || response.status === 499) { // invalid esri token
                                window.location.reload();
                                return;
                            }
                            if (response.status === 200 || response.status === 404) {
                                errCount = 0; // reset threshold
                                return;
                            }
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                }
            }
        });
    }
}


