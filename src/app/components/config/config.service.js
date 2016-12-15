export class ConfigService {
    constructor() {
        'ngInject';

        // zoom configuration
        this.zoom = {
            default: 4,
            zoomedIn: 13,
            oerebLayer: 11,
        };

        // default projection
        this.projection = {
            extent: [2440000, 1024000, 2895000, 1340000],
            epsg: 'EPSG:2056'
        };

        // default center
        this.center = [2604688.627, 1175634.936];

        // map services
        this.services = {
            wfsPropertyMarking: 'https://gs.novu.io/proxy/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer',
            oereb: 'https://www.oereb2-test.apps.be.ch/OerbverSVC.svc'
        };

        // layer configurations are in: ../layers/layers.service.js
    }
}
