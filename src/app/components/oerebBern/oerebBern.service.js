export class OerebBernService {
    constructor($http, $log) {
        'ngInject';

        this.qnapOffline = false;
        this.ssl = true;

        this.$http = $http;
        this.$log = $log;

        this.base = 'http://adue03.myqnapcloud.com/oereb/OerbverSVC.svc/';

        if (this.ssl) {
            this.base = 'https://adue03.myqnapcloud.com/OerbverSVC.svc/';

            // temporary proxy over novu
            this.base = 'https://adue03.novu.io/oereb/OerbverSVC.svc/';
        }

        this.reducedExtractPath = 'extract/reduced/xml/';

        if (this.qnapOffline) {
            this.base = 'https://oereb.plum.novu.ch/server/'
            this.reducedExtractPath = 'reduced/';
        }
    }

    getExtractById(egrid) {
        let url = this.base + this.reducedExtractPath + egrid;

        if (this.qnapOffline) {
            url = this.base + this.reducedExtractPath + egrid + '.xml';
        }

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

    getDataFromWFS(coordinatesOrEGRID) {
        if (angular.isString(coordinatesOrEGRID)) {
            var egrid = coordinatesOrEGRID;
            //var geoserviceNew = 'http://www.geoservice2-test.apps.be.ch/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:PropertyIsEqualTo%20matchCase=%22true%22%20xmlns:ogc=%22http://www.opengis.net/ogc%22%3E%3Cogc:PropertyName%3EEGRID%3C/ogc:PropertyName%3E%3Cogc:Literal%3E' + egrid + '%3C/ogc:Literal%3E%3C/ogc:PropertyIsEqualTo%3E%3C/ogc:Filter%3E';
            var geoserviceProxy = 'https://gs.novu.io/proxy/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:PropertyIsEqualTo%20matchCase=%22true%22%20xmlns:ogc=%22http://www.opengis.net/ogc%22%3E%3Cogc:PropertyName%3EEGRID%3C/ogc:PropertyName%3E%3Cogc:Literal%3E' + egrid + '%3C/ogc:Literal%3E%3C/ogc:PropertyIsEqualTo%3E%3C/ogc:Filter%3E';
        } else {
            var long = coordinatesOrEGRID[2056][0];
            var lat = coordinatesOrEGRID[2056][1];
            // var geoserviceNew = 'http://www.geoservice2-test.apps.be.ch/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:Contains%3E%3Cogc:PropertyName%3EShape%3C/ogc:PropertyName%3E%3Cgml:Point%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E%3Cgml:pos%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E2600000%201200000%3C/gml:pos%3E%3C/gml:Point%3E%3C/ogc:Contains%3E%3C/ogc:Filter%3E';
            var geoserviceProxy = 'https://gs.novu.io/proxy/geoservice2/services/a42geo/a42geo_ortsangabenwfs_d_fk/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF&Filter=%3Cogc:Filter%3E%3Cogc:Contains%3E%3Cogc:PropertyName%3EShape%3C/ogc:PropertyName%3E%3Cgml:Point%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E%3Cgml:pos%20srsName=%22urn:x-ogc:def:crs:EPSG:2056%22%3E' + long + '%20' + lat + '%3C/gml:pos%3E%3C/gml:Point%3E%3C/ogc:Contains%3E%3C/ogc:Filter%3E';
        }

        let self = this;
        var promise =  this.$http.get(
            geoserviceProxy,
            {
                // cache: true,
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);


                    if (angular.isArray(object.FeatureCollection.featureMember)) {
                        return object.FeatureCollection.featureMember;
                    }

                    var dipanuf = object.FeatureCollection.featureMember;
                    return [dipanuf];
                }
            }
        );

        return promise;
    }
}
