export class OerebBernService {
    constructor($http, $log) {
        'ngInject';

        this.qnapOffline = true;

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
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    if (object.GetExtractByIdResponse) {
                        return object.GetExtractByIdResponse.Extract;
                    }
                    
                    if (!object.GetEGRIDResponse) {
                        object.error = true;
                        return object;
                    }

                    return object.GetExtractByIdResponse.Extract;
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
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    self.$log.info(object);

                    if (!object || !object.GetEGRIDResponse) {
                        return false;
                    }

                    if (object.GetEGRIDResponse.egrid instanceof Array) {
                        return {
                            'egrid': object.GetEGRIDResponse.egrid,
                            'number': object.GetEGRIDResponse.number
                        };
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
}
