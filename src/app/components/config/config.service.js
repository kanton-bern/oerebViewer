export class ConfigService {
    constructor() {
        'ngInject';

        // zoom configuration
        this.zoom = {
            default: 0,
            zoomedIn: 13,
            oerebLayer: 11,
            min: 4,
            minTablet: 3,
            minMobile: 2
        };

        // default projection
        this.projection = {
            extent: [2485869.5728, 1076443.1884, 2837076.5648, 1299941.7864],
            epsg: 'EPSG:2056'
        };

        // default center
        this.center = [2616445.3125, 1190976.5625];

        // map services
        this.services = {
            wfsPropertyMarking: 'https://www.geoservice.apps.be.ch/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer',
            oereb: 'https://www.oereb2.apps.be.ch/OerbverSVC.svc',
            extern: 'http://www.map.apps.be.ch/pub/synserver?query1=egrid&keyvalue1=[[EGRID]]&keyname1=EGRID&project=a42pub_oereb&language=[[LANGUAGE]]&userprofile=geo'
        };

        this.opacityRestrictionLayers = 0.7;


        // layer configurations are in: ../layers/layers.service.js
    }
}
