export function HttpRequestInterceptorFactory () {
    'ngInject';

    return function () {
        return {
            request: function (config) {

                if (config.url.indexOf('geodienste.ch') !== -1) {
                    config.headers['Authorization'] = 'Basic Z2VvZGllbnN0ZV9iZTplZmVtYWlIMA==';
                }

                return config;
            }
        }
    }
}
