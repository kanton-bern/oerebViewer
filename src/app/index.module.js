/* global moment:false */
import angular from 'angular';
import moment from 'moment';
import 'angular-animate';
import 'angular-cookies';
import 'angular-touch';
import 'angular-sanitize';
import 'v-accordion';
import 'angular-messages';
import 'angular-aria';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-local-storage';
import 'angular-ui-notification';
import 'angular-base64';
import 'angular-typeahead';
import 'angular-translate';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'angular-translate-loader-static-files';
import 'angular-carousel';
import 'angular-gettext';
import 'floatthead';

// core imports
import { Config } from './index.config';
import { ConfigService } from '../app/components/config/config.service';
import { RouterConfig } from './index.route';

// utilities
import { UniqueFilter } from '../app/components/utilities/unique.filter';
import { LegalsFilter } from '../app/components/utilities/legals.filter';
import { HttpRequestInterceptorFactory } from '../app/components/utilities/httpRequestInterceptor.factory';

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
import { OEREBService } from '../app/components/oereb/oereb.service';
import { WFSService } from '../app/components/wfs/wfs.service';

// search imports
import { SearchDirective } from '../app/components/search/search.directive';

// utilities imports
import { HelpersService } from '../app/components/helpers/helpers.service';
import { CoordinatesService } from '../app/components/coordinates/coordinates.service';
import { LoadingDirective } from '../app/components/loading/loading.directive';
import { LoadingService } from '../app/components/loading/loading.service';
import { MobileClickDirective } from '../app/components/mobileclick/mobileclick.directive';
import { LegalListDirective } from '../app/components/legallist/legallist.directive';
import { LegalEntryDirective } from '../app/components/legalentry/legalentry.directive';
import { EsriTokenService } from '../app/components/esritoken/esritoken.service';


const MODULE_NAME = 'oerebApp';

angular.module(MODULE_NAME, [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'vAccordion',
    'ngMessages',
    'ngAria',
    'ngResource',
    'ui.router',
    'LocalStorageModule',
    'ui-notification',
    'base64',
    'ngeo',
    'siyfion.sfTypeahead',
    'pascalprecht.translate',
    'angular-carousel'
])
    .constant('moment', moment)

    .factory('httpRequestInterceptor', HttpRequestInterceptorFactory)

    // load configs
    .config(Config)
    .config(RouterConfig)

    // register services
    .service('Config', ConfigService)
    .service('Coordinates', CoordinatesService)
    .service('Helpers', HelpersService)
    .service('OEREB', OEREBService)
    .service('WFS', WFSService)
    .service('EsriToken', EsriTokenService)
    .service('Layers', LayersService)
    .service('Extracts', ExtractsService)
    .service('Loading', LoadingService)
    .service('Map', MapService)

    // register controllers
    .controller('MainController', MainController)
    .controller('DetailController', DetailController)

    // register directives
    .directive('ngMobileClick', MobileClickDirective)
    .directive('map', MapDirective)
    .directive('loading', LoadingDirective)
    .directive('search', SearchDirective)
    .directive('restriction', RestrictionDirective)
    .directive('legalList', LegalListDirective)
    .directive('legalEntry', LegalEntryDirective)

    // register filters
    .filter('unique', UniqueFilter)
    .filter('legals', LegalsFilter);

export default MODULE_NAME;
