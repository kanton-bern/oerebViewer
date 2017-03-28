export class OEREBService {
    constructor(Config, $http, $log, $base64, Notification, $filter, $translate) {
        'ngInject';

        this.$http = $http;
        this.$log = $log;
        this.$base64 = $base64;
        this.$filter = $filter;
        this.$translate = $translate;
        this.Notification = Notification;
        this.Config = Config;

        this.reducedExtractPath = 'extract/reduced/xml/';
    }

    getExtractById(egrid) {
        let self = this;

        let lang = '';

        if (self.$translate.use() !== undefined)
            lang = self.$translate.use();

        let url = this.Config.services.oereb + '/' + this.reducedExtractPath + egrid + '?lang=' + lang;

        let promise = this.$http.get(url,
            {
                cache: true,
                transformResponse: function (data) {
                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);

                    //console.debug(data);


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
            }).catch(function() {
                self.Notification.warning(self.$filter('translate')('oerebServiceNotAvailable'));
            });

        return promise;
    }

    getEGRID(coordinates) {
        let self = this;

        let long = coordinates[4326][1];
        let lat = coordinates[4326][0];

        let url = this.Config.services.oereb + '/getegrid/?GNSS=' + long + ',' + lat;

        let promise = this.$http.get(
            url,
            {
                cache: true,
                transformResponse: function (data) {
                    if (data.status == 204)
                        throw data;

                    let x2js = new X2JS();
                    let object = x2js.xml_str2json(data);
                    self.$log.info(object);

                    if (!object || !object.GetEGRIDResponse) {
                        return false;
                    }

                    if (angular.isArray(object.GetEGRIDResponse.egrid)) {
                        let results = [];
                        for (let i = 0; i < object.GetEGRIDResponse.egrid.length; i++) {
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
        ).catch(function(data) {

            let warning = self.$filter('translate')('oerebServiceNotAvailable');

            if (data.status == 500)
                warning = self.$filter('translate')('oerebService500');

            if (data.status == 204)
                warning = self.$filter('translate')('oerebService204');

            self.Notification.warning(warning);
        });

        return promise;
    }
}
