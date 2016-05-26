export class LayersService {
    constructor() {
        'ngInject';

        this.layers = [];
        this.ol = ol;
        this.active = 'ortho';

        var RESOLUTIONS = [
            4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
            1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
        ];
        var extent = [2420000, 130000, 2900000, 1350000];
        var projection = ol.proj.get('EPSG:2056');
        projection.setExtent(extent);


        var matrixIds = [];
        for (var i = 0; i < RESOLUTIONS.length; i++) {
            matrixIds.push(i);
        }

        let wmtsSource = function(layerConfig) {
            var resolutions = layerConfig.resolutions || RESOLUTIONS;
            var tileGrid = new ol.tilegrid.WMTS({
                origin: [extent[0], extent[3]],
                resolutions: resolutions,
                matrixIds: matrixIds
            });
            var extension = layerConfig.format || 'png';
            var timestamp = layerConfig['timestamps'][0];
            return new ol.source.WMTS(({
                url: '//wmts10.geo.admin.ch/1.0.0/{Layer}/default/' + timestamp + '/2056/{TileMatrix}/{TileCol}/{TileRow}.'+ extension,
                tileGrid: tileGrid,
                projection: projection,
                layer: layerConfig.serverLayerName,
                requestEncoding: 'REST'
            }));
        };

        var wmtsSat = new this.ol.layer.Tile({
            name: 'aerial',
            visible: false,
            source: wmtsSource({
                "format": "jpeg",
                "serverLayerName": "ch.swisstopo.swissimage",
                "label": "SWISSIMAGE",
                "timestamps": [
                    "20140620",
                    "20131107",
                    "20130916",
                    "20130422",
                    "20120809",
                    "20120225",
                    "20110914",
                    "20110228"
                ]
            })
        });



        var wmtsOrtho = new this.ol.layer.Tile({
            name: 'ortho',
            visible: true,
            source: wmtsSource({
                "format": "jpeg",
                "serverLayerName": "ch.swisstopo.pixelkarte-farbe",
                "label": "SWISSIMAGE",
                "timestamps": [
                    "20140620",
                    "20131107",
                    "20130916",
                    "20130422",
                    "20120809",
                    "20120225",
                    "20110914",
                    "20110228"
                ]
            })
        });

        var wmsOrtho =   new ol.layer.Tile({
            name: 'ortho',
            visible: true,
            source: new ol.source.TileWMS({
                attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
                'en/home.html">Pixelmap 1:1000000 / geo.admin.ch</a>',
                crossOrigin: 'anonymous',
                params: {
                    'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                    'FORMAT': 'image/jpeg'
                },
                url: 'http://wms.geo.admin.ch/'
            })
        });


        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'ortho'
        });


        let wmsOEREB = new this.ol.layer.Tile({
            /*preload: Infinity,*/
            visible: true,
            source: new this.ol.source.TileWMS(({
                    url: 'http://www.geoservice.apps.be.ch/geoservice/services/a42pub/a42pub_oereb_av_wms_d_bk_s/MapServer/WMSServer?',
                    params: {
                        'LAYERS': 'GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE',  // LAYERS=GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE
                        'TILED': true,
                        'VERSION': '1.3.0',
                        'FORMAT': 'image/png',
                        'CRS': 'EPSG:21781'
                    },
                    serverType: 'geoserver'
                })),
            name: 'oereb'
        });

        let oerebStatusSource = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a42pub/a42pub_oereb_wms_d_fk_s/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.OEREBST_OESTATUS',  // LAYERS=GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE
                'TILED': true,
                'VERSION': '1.3.0',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:21781'
            },
            serverType: 'geoserver'
        }));

        let wmsOEREBStatus = new this.ol.layer.Tile({
            /*preload: Infinity,*/
            visible: true,
            source: oerebStatusSource,
            name: 'oereb'
        });


        // this.add(osmLayer);
        this.add(wmsOrtho);
        this.add(wmtsSat);
        this.add(wmsOEREBStatus);
        this.add(wmsOEREB);
    }

    isActive(name) {
        console.log('round:');
        for (var i = 0; i < this.layers.length; i++) {
            console.log(this.layers[i].M.name);
            console.log(this.layers[i].visible);
            if (this.layers[i].M.name == name) {
                return this.layers[i].visible;
            }
        }
        
        return false;
    }

    hide(name, inverse = false) {
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].M.name == name) {
                this.layers[i].visible = inverse;
            }
        }

        return name;
    }

    show(name) {
        return this.hide(name, true);
    }

    get() {
        return this.layers;
    }

    add(layer) {
        this.layers.push(layer);
    }

}


