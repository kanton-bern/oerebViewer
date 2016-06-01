export class OerebBernService {
    constructor($http, $log) {
        'ngInject';

        this.qnapOffline = false;

        this.$http = $http;
        this.$log = $log;

        this.base = 'http://adue03.myqnapcloud.com/oereb/OerbverSVC.svc/';
        this.reducedExtractPath = 'extract/reduced/xml/';

        if (this.qnapOffline) {
            this.base = 'http://oereb.plum.novu.ch/server/'
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

    getEGRID(long, lat) {
        let self = this;
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

    getDataFromWFS(long, lat) {
        let self = this;

        var promise =  this.$http.get(
            'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_ortsangabenwfs_d_fk_x/MapServer/WFSServer?service=WFS&request=GetFeature&version=1.1.0&typename=a4p_a4p_ortsangabenwfs_d_fk_x:DIPANU_DIPANUF%20&Filter=%3Cogc:Filter%3E%20%3Cogc:Intersects%3E%20%3Cogc:PropertyName%3ESHAPE%3C/ogc:PropertyName%3E%20%3Cgml:Point%3E%20%3Cgml:coordinates%3E2603179.2831421704,%201203520.3550739398%3C/gml:coordinates%3E%20%3C/gml:Point%3E%20%3C/ogc:Intersects%3E%20%3C/ogc:Filter%3E',
            {
                // cache: true,
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    return object;
                }
            }
        );

        return promise;
    }
}
