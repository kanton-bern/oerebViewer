export class ConfigService {
    constructor() {
        'ngInject';

        // zoom configuration
        this.zoom = {
            default: 4,
            zoomedIn: 13
        };

        // default projection
        this.projection = {
            extent: [2440000, 1024000, 2895000, 1340000],
            epsg: 'EPSG:2056'
        };

        // default center
        this.center = [2604688.627, 1175634.936];



    }
}
