export class LayersService {
    constructor() {
        'ngInject';

        this.layers = [];
        this.ol = ol;
        this.active = 'ortho';

        // example ImageWMS
        /*let exampleImageWms = new ol.layer.Image({
         source: new ol.source.ImageWMS({
         url: 'http://wms.geo.admin.ch/',
         ratio: 1.0,
         projection: 'EPSG:21781',
         params: {
         'LAYERS': ['ch.swisstopo.pixelkarte-farbe'],
         'FORMAT': 'image/png',
         'TILED': false
         },
         serverType: 'mapserver'
         })
         }); */

        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'ortho'
        });

        let satLayer = new this.ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'}),
            name: 'aerial',
            visible: false
        });

        let wmsSat = new this.ol.source.TileWMS(({
            url: 'https://wms.swisstopo.admin.ch/wss/httpauth/swisstopowms/?',
            params: {
                'LAYERS': 'ch.swisstopo.pixelkarte-grau',
                'TRANSPARENT': true,
                'FORMAT': 'image/png',
                'SERVICE': 'WMS',
                'VERSION': '1.1.1',
                'REQUEST': 'GetMap',
                'EXCEPTIONS': 'application/vnd.ogc.se_inimage',
                'BBOX': '258000,41500,1062000,346000',
                'SRS': 'EPSG:21781'
            },
            serverType: 'geoserver'
        }));

        /*let satLayer = new this.ol.layer.Tile({
            preload: Infinity,
            visible: true,
            source: wmsSat,
        });*/

        let oerebSource = new this.ol.source.TileWMS(({
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
            source: oerebSource,
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


        let wmsCantoneCadestral = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_planungwms_d_fk_s/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.UZP_BAU_det',
                'TILED': true,
                'VERSION': '1.1.1',
                'FORMAT': 'image/png'
                //'CRS': 'EPSG:3857'
            },
            serverType: 'geoserver'
        }));

        let cantoneCadestral = new this.ol.layer.Tile({
            preload: Infinity,
            visible: true,
            source: wmsCantoneCadestral,
            minResolution: 0.001,
            maxResolution: 100,
        });

        // http://openlayers.org/en/v3.3.0/examples/vector-wfs.js
        //  WFS: http://www.geoservice2-test.apps.be.ch/geoservice/rest/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/4
        // http://www.geoservice2-test.apps.be.ch/geoservice/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/WFSServer?

        this.add(osmLayer);
        this.add(satLayer);
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

    get() {
        return this.layers;
    }

    add(layer) {
        this.layers.push(layer);
    }

}


