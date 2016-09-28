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

        let self = this;

        let osmLayer = new this.ol.layer.Tile({
            source: new this.ol.source.OSM(),
            name: 'ortho'
        });


        /*let arcgisOrtho = new ol.layer.Tile({
            visible: true,
            name: 'oereb',
            extent: extent,
            source: new ol.source.TileArcGISRest({
                params: {
                    'TILED': true,
                    'VERSION': '1.0.0',
                    'FORMAT': 'image/jpeg',
                    'CRS': 'EPSG:2056'
                },
                url: 'http://www.geoservice2-test.apps.be.ch/geoservice2/rest/services/a4p/a4p_orthofoto_n_bk/MapServer'
            })
        }); */

        let arcgisOrtho = new ol.layer.Tile({
            opacity: 0.7,
            source: new ol.source.WMTS({
                attributions: 'Tiles © <a href="http://services.arcgisonline.com/arcgis/rest/' +
                'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
                url: 'http://www.geoservice2-test.apps.be.ch/geoservice2/rest/services/a4p/a4p_orthofoto_n_bk/MapServer/WMTS/',
                layer: '0',
                matrixSet: 'EPSG:2056',
                format: 'image/jpeg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: [extent[0], extent[3]],
                    resolutions: this.resolutions,
                    matrixIds: matrixIds
                }),
                style: 'default',
                wrapX: true
            })
        });


        this.wmsOerebSource = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a42pub/a42pub_oereb_av_wms_d_bk_s/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE',  // LAYERS=GEODB.AVR_BOF,GEODB.DIPANU_DIPANUF_SR,GEODB.DIPANU_DIPANUF_SR_B,GEODB.DIPANU_DIPANUF,GEODB.DIPANU_DIPANUF_B,GEODB.GRENZ5_G5_B,GEODB.TELEDAT_NW,GEODB.GEBADR_GADR,GEODB.AVR_PELE,GEODB.AVR_LELE,GEODB.AVR_FELE
                'TILED': true,
                'VERSION': '1.3.0',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:21781',
                'TRANSPARENT': false
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


        this.add(arcgisOrtho);

        // this.add(osmLayer);
        // this.add(wmsOrtho);
        //this.add(wmtsSat);
        /*this.add(wmsOEREBStatus); */
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

        console.log(this.layers);
    }
}


