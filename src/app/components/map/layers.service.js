export class LayersService {
    constructor() {
        'ngInject';

        this.ol = ol;
        this.Map = Map;

        this.active = 'ortho';
        this.layers = [];

        this.resolutions = [
            4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
            1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
        ];

        var extent = [2420000, 130000, 2900000, 1350000];
        var projection = ol.proj.get('EPSG:2056');
        projection.setExtent(extent);


        var matrixIds = [];
        for (var i = 0; i < this.resolutions.length; i++) {
            matrixIds.push(i);
        }

        let self = this;

        let wmtsSource = function(layerConfig) {
            var resolutions = layerConfig.resolutions || self.resolutions;
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
                crossOrigin: 'anonymous',
                params: {
                    'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                    'FORMAT': 'image/jpeg'
                },
                url: 'http://wms.geo.admin.ch/'
            })
        });


        /*
            Vector Layer Example

        var vectorSource = new ol.source.Vector({
            //format: new ol.format.GeoJSON(),
            format: new ol.format.WFS(),
            loader: function(extent, resolution, projection) {

                var url = 'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF%20&Filter=%3Cogc:Filter%3E%20%3Cogc:Intersects%3E%20%3Cogc:PropertyName%3ESHAPE%3C/ogc:PropertyName%3E%20%3Cgml:Point%3E%20%3Cgml:coordinates%3E2603179.2831421704,%201203520.3550739398%3C/gml:coordinates%3E%20%3C/gml:Point%3E%20%3C/ogc:Intersects%3E%20%3C/ogc:Filter%3E';


                $.ajax({
                    url: url,
                    dataType: 'xml',
                });
            },
            projection: 'EPSG:2056'
        });

        var loadFeatures = function(response) {
            vectorSource.addFeatures(vectorSource.readFeatures(response));
        };

        var vector = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                })
            })
        });

        this.add(vector); */


        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'ortho'
        });


        this.wmsOerebSource = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a42pub/a42pub_oereb_av_wms_d_bk_s/MapServer/WMSServer?',
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
            /*preload: Infinity,*/
            visible: true,
            source: this.wmsOerebSource,
            name: 'oereb'
        });

        wmsOEREB.setZIndex(100);


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


        this.add(osmLayer);
        // this.add(wmsOrtho);
        this.add(wmtsSat);
        this.add(wmsOEREBStatus);
        this.add(wmsOEREB);
    }

    isActive(name) {
        for (var i = 0; i < this.layers.length; i++) {
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

    get(name = false) {
        if (angular.isString(name)) {
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i].M.name == name) {
                    return this.layers[i];
                }
            }
        }

        return this.layers;
    }

    /*
        only works before map initialization, after that use Map.addTempLayer()
     */
    add(layer) {
        this.layers.push(layer);
    }
}


