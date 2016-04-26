export class OerebBernService {
    constructor($http, $log) {
        'ngInject';

        this.$http = $http;
        this.$log = $log;

        this.base = 'http://adue03.myqnapcloud.com/oereb/OerbverSVC.svc/';

    }

    getExtractById(egrid) {
        /*
         https://example.com/oereb/extract/reduced/xml/CH887722167773
         https://example.com/oereb/extract/reduced/xml/geometry/CH887722167773
         https://example.com/oereb/extract/full/pdf/BE0200000332/100
         */

        // example xml: sandbox.novu.ch/oereb/DOC_362_0_995_CH.xml


        let exampleXMLUrl = 'http://sandbox.novu.ch/DOC_362_0_995_CH.xml';
        this.$log.warn('getExtractById: ' + egrid);

        this.$http.get(
            exampleXMLUrl,
            {
                transformResponse: function (data) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    let x2js = new X2JS();
                    let json = x2js.xml_str2json(data);
                    return json;
                }
            }
        ).success(function (data, status) {
            // send the converted data back
            // to the callback function
            console.log(data);
        });

        return 'test';
    }


    getEGRID(long, lat) {
        self = this;
        this.$log.info('getEgrid('+long+','+lat+'): ');

        let url = this.base + 'getegrid/?GNSS=' + long + ',' + lat;

        return this.$http.get(
            url,
            {
                transformResponse: function (data) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    self.$log.info(object);

                    if (!object  || !object.GetEGRIDResponse)
                        return false;

                    if (object.GetEGRIDResponse.egrid instanceof Array)
                        return object.GetEGRIDResponse.egrid;

                    return [object.GetEGRIDResponse.egrid];
                }
            }
        );
    }
}
