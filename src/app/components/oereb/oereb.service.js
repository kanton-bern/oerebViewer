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
    }

    getExtractById(egrid) {
        let lang = this.$translate.use() !== undefined ? this.$translate.use() : this.$translate.proposedLanguage();
        let url = this.Config.services.oereb + '/extract/reduced/json/' + egrid + '?LANG=' + lang;

        return this.$http.get(url, {
                cache: false,
                transformResponse: (response) => {
                    let data = JSON.parse(response);

                    if (!angular.isObject(data)) {
                        return false;
                    }

                    if (! angular.isDefined(data.GetExtractByIdResponse)) {
                        return false;
                    }

                    return data.GetExtractByIdResponse.extract;
                }
            }).catch(() => {
                this.Notification.warning(this.$filter('translate')('oerebServiceNotAvailable'));
            }
        );
    }

    getEGRID(coordinates) {
        let long = coordinates[4326][1];
        let lat = coordinates[4326][0];

        let url = this.Config.services.oereb + '/getegrid/json/?GNSS=' + long + ',' + lat;

        let promise = this.$http.get(
            url,
            {
                cache: true,
                transformResponse: (response) => {
                    let data = JSON.parse(response);

                    if (!angular.isObject(data) ||  !angular.isDefined(data.GetEGRIDResponse)) {
                        return false;
                    }

                    return data.GetEGRIDResponse
                }
            }
        ).catch((data) => {

            let warning = this.$filter('translate')('oerebServiceNotAvailable');

            if (data.status == 500)
                warning = this.$filter('translate')('oerebService500');

            if (data.status == 204)
                warning = this.$filter('translate')('oerebService204');

            this.Notification.warning(warning);
        });

        return promise;
    }
}
