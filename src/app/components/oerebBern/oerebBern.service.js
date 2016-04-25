export class OerebBernService {
    constructor($http) {
        'ngInject';

        this.$http = $http;

    }

    getExtractById(egrid) {
        /*
         https://example.com/oereb/extract/reduced/xml/CH887722167773
         https://example.com/oereb/extract/reduced/xml/geometry/CH887722167773
         https://example.com/oereb/extract/full/pdf/BE0200000332/100
         */

        // example xml: sandbox.novu.ch/oereb/DOC_362_0_995_CH.xml
        var exampleXMLUrl = 'http://sandbox.novu.ch/DOC_362_0_995_CH.xml';

        this.$http.get(
            exampleXMLUrl,
            {
                transformResponse: function (data) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
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
