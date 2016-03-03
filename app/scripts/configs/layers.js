// define layers
    var attributions = [
        new ol.Attribution({
            html: '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
            '&copy swisstopo / Amtliche Vermessung Schweiz/FL</a>'
        })
    ];

    var wmsCadastre = new ol.layer.Tile({
        extent: [420000, 30000, 900000, 350000],
        source: new ol.source.TileWMS({
            url: 'http://wms.geo.admin.ch/',
            crossOrigin: 'anonymous',
            attributions: attributions,
            params: {
                'LAYERS': 'ch.kantone.cadastralwebmap-farbe',
                'FORMAT': 'image/png',
                'TILED': true,
                'VERSION': '1.1.1'
            },
            serverType: 'mapserver'
        })
    });

    var exampleLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://demo.opengeo.org/geoserver/wms',
            params: {'LAYERS': 'topp:states'},
            serverType: 'geoserver',
            extent: [-13884991, 2870341, -7455066, 6338219]
        })
    });

    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });


    var myLayer1303 = new ol.layer.Tile({
        extent: [2033814, 6414547, 2037302, 6420952],
        preload: Infinity,
        visible: true,
        source: new ol.source.TileWMS(({
            url: 'http://wms.geo.admin.ch/',
            params: {
                'LAYERS': 'ch.kantone.cadastralwebmap-farbe',
                'TILED': true,
                'VERSION': '1.1.1',
                'FORMAT': 'image/png',
                'CRS': 'EPSG:3857'
            },
            serverType: 'geoserver'
        }))
    });

    /*var cantoneCadestral = new ol.layer.Tile({
        preload: Infinity,
        visible: true,
        source: new ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_basiswms_d_fk_s/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.UP5_SITU5_MOSAIC',
                'TILED': true,
                'VERSION': '1.1.1',
                'FORMAT': 'image/png',
                //'CRS': 'EPSG:3857'
            },
            serverType: 'geoserver'
        }))
    });*/

    var wmsCantoneCadestral = new ol.source.TileWMS(({
        url: 'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_planungwms_d_fk_s/MapServer/WMSServer?',
        params: {
            'LAYERS': 'GEODB.UZP_BAU_det',
            'TILED': true,
            'VERSION': '1.1.1',
            'FORMAT': 'image/png',
            //'CRS': 'EPSG:3857'
        },
        serverType: 'geoserver'
    }));

    var cantoneCadestral = new ol.layer.Tile({
        preload: Infinity,
        visible: true,
        source: wmsCantoneCadestral,
    });



    // http://openlayers.org/en/v3.3.0/examples/vector-wfs.js
    //  WFS: http://www.geoservice2-test.apps.be.ch/geoservice/rest/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/4
    // http://www.geoservice2-test.apps.be.ch/geoservice/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/WFSServer?




    var mainLayers = [
      //myLayer1303, osmLayer, exampleLayer, wmsCadastre,
      osmLayer, cantoneCadestral
    ];
