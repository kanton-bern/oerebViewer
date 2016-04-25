/* global moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { LayersService } from '../app/components/map/layers.service';
import { OerebBernService } from '../app/components/oerebBern/oerebBern.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MapDirective } from '../app/components/map/map.directive';

angular.module('oerebAppV2', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr', 'base64', 'ngeo', 'siyfion.sfTypeahead', 'pascalprecht.translate'])
    .constant('moment', moment)

    .config(config)
    .config(routerConfig)

    .run(runBlock)

    .service('Oereb', OerebBernService)
    .service('Layers', LayersService)

    .controller('MainController', MainController)
    .directive('acmeNavbar', NavbarDirective)
    .directive('map', MapDirective);
