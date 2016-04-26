export class OerebBernService {
    constructor($http, $log) {
        'ngInject';

        this.$http = $http;
        this.$log = $log;

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


    getEGRID(gnss) {
        // baseurl / getegrid/?GNSS=gnss
    }
}
