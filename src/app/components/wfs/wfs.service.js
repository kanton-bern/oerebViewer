export class WFSService {
    constructor(Config) {
        'ngInject';

        this.Config = Config;

    }

    getSource(coordinatesOrEGRID) {
        let url = '';
        let wfsServer = this.Config.services.wfsPropertyMarking;

        if (angular.isString(coordinatesOrEGRID)) {
            url = wfsServer + '?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:PropertyIsEqualTo%20matchCase=%22true%22%20xmlns:ogc=%22http://www.opengis.net/ogc%22%3E%3Cogc:PropertyName%3EEGRID%3C/ogc:PropertyName%3E%3Cogc:Literal%3E' + coordinatesOrEGRID + '%3C/ogc:Literal%3E%3C/ogc:PropertyIsEqualTo%3E%3C/ogc:Filter%3E';
        } else {
            let long = coordinatesOrEGRID[2056][0];
            let lat = coordinatesOrEGRID[2056][1];
            url = wfsServer + '?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:Contains%3E%3Cogc:PropertyName%3EShape%3C/ogc:PropertyName%3E%3Cgml:Point%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E%3Cgml:pos%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E' + long + '%20' + lat + '%3C/gml:pos%3E%3C/gml:Point%3E%3C/ogc:Contains%3E%3C/ogc:Filter%3E';
        }

        return fetch(url, {
            method: 'get',
        }).then(function(response) {
            return response.text();
        }).then(function(xml) {
            let features = new ol.format.WFS().readFeatures(xml);

            let vectorSource = new self.ol.source.Vector({
                features: features
            });

            return vectorSource;

        }).catch(function(ex) {
            console.error(ex);
        });
    }
}
