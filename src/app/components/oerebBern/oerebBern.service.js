export class OerebBernService {
    constructor($http, $log, $base64) {
        'ngInject';

        this.$http = $http;
        this.$log = $log;
        this.$base64 = $base64;

        this.base = 'https://www.oereb2-test.apps.be.ch/OerbverSVC.svc/';

        this.reducedExtractPath = 'extract/reduced/xml/';
    }

    getExtractById(egrid) {
        let url = this.base + this.reducedExtractPath + egrid;

        var promise = this.$http.get(url,
            {
                cache: true,
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    if (!angular.isObject(object))
                        return false;

                    if (angular.isDefined(object.GetExtractByIdResponse)) {
                        return object.GetExtractByIdResponse.Extract;
                    }

                    if (!object.GetEGRIDResponse) {
                        object.error = true;
                        return object;
                    }

                    return false;
                }
            });

        return promise;
    }

    getEGRID(coordinates) {
        let self = this;

        var long = coordinates[4326][1];
        var lat = coordinates[4326][0];

        let url = this.base + 'getegrid/?GNSS=' + long + ',' + lat;

        var promise = this.$http.get(
            url,
            {
                cache: true,
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);
                    self.$log.info(object);

                    if (!object || !object.GetEGRIDResponse) {
                        return false;
                    }

                    if (angular.isArray(object.GetEGRIDResponse.egrid)) {
                        let results = [];
                        for (var i = 0; i < object.GetEGRIDResponse.egrid.length; i++) {
                            results[i] = {
                                'egrid': object.GetEGRIDResponse.egrid[i],
                                'number': object.GetEGRIDResponse.number[i]
                            }
                        }
                        return results;
                    }

                    return [{
                        'egrid': object.GetEGRIDResponse.egrid,
                        'number': object.GetEGRIDResponse.number
                    }];
                }
            }
        );

        return promise;
    }


    getWFSSource(coordinatesOrEGRID) {
        var wfsServer = 'https://gs.novu.io/proxy/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer';
        if (angular.isString(coordinatesOrEGRID)) {
            var egrid = coordinatesOrEGRID;
            var geoserviceProxy = wfsServer + '?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:PropertyIsEqualTo%20matchCase=%22true%22%20xmlns:ogc=%22http://www.opengis.net/ogc%22%3E%3Cogc:PropertyName%3EEGRID%3C/ogc:PropertyName%3E%3Cogc:Literal%3E' + egrid + '%3C/ogc:Literal%3E%3C/ogc:PropertyIsEqualTo%3E%3C/ogc:Filter%3E';
        } else {
            var long = coordinatesOrEGRID[2056][0];
            var lat = coordinatesOrEGRID[2056][1];
            var geoserviceProxy = wfsServer + '?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:Contains%3E%3Cogc:PropertyName%3EShape%3C/ogc:PropertyName%3E%3Cgml:Point%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E%3Cgml:pos%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E' + long + '%20' + lat + '%3C/gml:pos%3E%3C/gml:Point%3E%3C/ogc:Contains%3E%3C/ogc:Filter%3E';
        }

        return fetch(geoserviceProxy, {
            method: 'get',
        }).then(function(response) {
            return response.text();
        }).then(function(xml) {
            var features = new ol.format.WFS().readFeatures(xml);

            var vectorSource = new self.ol.source.Vector({
                features: features
            });

            return vectorSource;

        }).catch(function(ex) {
            console.error(ex);
        });
    }
}
