/* global moment:false */

// core imports
import { Config } from './index.config';
import { RouterConfig } from './index.route';

// controller imports
import { MainController } from './main/main.controller';
import { DetailController } from './detail/detail.controller';

// map imports
import { MapDirective } from '../app/components/map/map.directive';
import { MapService } from '../app/components/map/map.service';

// layer imports
import { LayersService } from '../app/components/layers/layers.service';

// extract & restriction imports
import { ExtractsService } from '../app/components/extracts/extracts.service';
import { RestrictionDirective } from '../app/components/restriction/restriction.directive';
import { OerebBernService } from '../app/components/oerebBern/oerebBern.service';

// search imports
import { SearchSwisstopoDirective } from '../app/components/search/searchSwisstopo.directive';
// import { SearchMapboxDirective } from '../app/components/search/searchMapbox.directive';

// utilities imports
import { HelpersService } from '../app/components/helpers/helpers.service';
import { CoordinatesService } from '../app/components/coordinates/coordinates.service';
import { LoadingDirective } from '../app/components/loading/loading.directive';
import { LoadingService } from '../app/components/loading/loading.service';


angular.module('oerebAppV2', ['ngAnimate', 'ngCookies', 'ngTouch', 'ng-fastclick', 'ngSanitize', 'vAccordion', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'LocalStorageModule', 'ui-notification', 'base64', 'ngeo', 'siyfion.sfTypeahead', 'pascalprecht.translate', 'angular-carousel'])
    .constant('moment', moment)

    .factory('httpRequestInterceptor', function () {
        return {
            request: function (config) {

                if (config.url.indexOf('geodienste.ch') !== -1) {
                    config.headers['Authorization'] = 'Basic Z2VvZGllbnN0ZV9iZTplZmVtYWlIMA==';
                }

                return config;
            }
        };
    })

    .config(Config)
    .config(RouterConfig)

    // register services
    .service('Coordinates', CoordinatesService)
    .service('Helpers', HelpersService)
    .service('Oereb', OerebBernService)
    .service('Layers', LayersService)
    .service('Extracts', ExtractsService)
    .service('Loading', LoadingService)
    .service('Map', MapService)

    // register controllers
    .controller('MainController', MainController)
    .controller('DetailController', DetailController)

    // register directives
    .directive('map', MapDirective)
    .directive('loading', LoadingDirective)
    .directive('search', SearchSwisstopoDirective)
    .directive('restriction', RestrictionDirective)

    // unique filter
    .filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };
    });

