/*
     Example Usage:

     Coordinates.set('coordinateName', Coordinates.System[2056], [204124, 142002]);
     let coordinates = Coordinates.get('testing', Coordinates.System[4326]);
*/

export class CoordinatesService {
    constructor() {
        'ngInject';

        this.coordinates = {};

        this.System = {
            2056: {
                'type': 2056,
                'proj4': '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
            },
            // international
            4326: {
                'type': 4326,
                'proj4': '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
            },
            21781: {
                'type': 21781,
                'proj4': '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
            }
        }
    }

    create(system, coordinates) {
        let self = this;

        // declare new coordinate
        let current = {};

        let coordinates4326 = coordinates;

        // lets get 4326 (international coordinates first) - if not already
        if (system != this.System[4326])
            coordinates4326 =  this.transform(coordinates, system, this.System[4326]);

        current[4326] = coordinates4326;

        angular.forEach(self.System, function(currentSystem) {
            // skip 4326
            if (currentSystem != self.System[4326]) {

                current[currentSystem.type] = self.transform(coordinates4326, self.System[4326], currentSystem);

            }
        });

        return current;
    }

    set(name, system, coordinates) {
        let self = this;

        // declare new coordinate
        this.coordinates[name] = {};

        let coordinates4326 = coordinates;

        // lets get 4326 (international coordinates first) - if not already
        if (system != this.System[4326])
             coordinates4326 =  this.transform(coordinates, system, this.System[4326]);

        self.coordinates[name][4326] = coordinates4326;

        angular.forEach(self.System, function(currentSystem) {
            // skip 4326
            if (currentSystem != self.System[4326]) {
                self.coordinates[name][currentSystem.type] = self.transform(coordinates4326, self.System[4326], currentSystem);
            }
        });

        return self.coordinates[name];
    }

    get(name, system) {
        if (!(name in this.coordinates)) {
            console.error('[coordinates] coordinate name doesn\'t exists');
            return null;
        }

        if (system === undefined)
            return this.coordinates[name];

        if (!(system.type in this.coordinates[name])) {
            console.error('[coordinates] system doesn\'t exists');
            return null;
        }

        return this.coordinates[name][system.type];
    }


    transform(coordinates, systemFrom, systemTo) {
        return proj4(systemFrom.proj4, systemTo.proj4, coordinates);
    }
}
