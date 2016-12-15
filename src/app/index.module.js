/* global moment:false */

// core imports
import { Config } from './index.config';
import { ConfigService } from '../app/components/config/config.service';
import { RouterConfig } from './index.route';

// utilities
import {UniqueFilter} from '../app/components/utilities/unique.filter';
import {HttpRequestInterceptorFactory} from '../app/components/utilities/httpRequestInterceptor.factory';

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

    .factory('httpRequestInterceptor', HttpRequestInterceptorFactory)

    .config(Config)
    .config(RouterConfig)

    // register services
    .service('Config', ConfigService)
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

    .filter('unique', UniqueFilter);
