/* global moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { DetailController } from './detail/detail.controller';
import { LayersService } from '../app/components/map/layers.service';
import { OerebBernService } from '../app/components/oerebBern/oerebBern.service';
import { ExtractsService } from '../app/components/extracts/extracts.service';
import { NotificationsService } from '../app/components/notifications/notifications.service';
import { LoadingService } from '../app/components/loading/loading.service';
import { HelpersService } from '../app/components/helpers/helpers.service';
import { MapService } from '../app/components/map/map.service';
import { MapDirective } from '../app/components/map/map.directive';
import { RestrictionDirective } from '../app/components/restriction/restriction.directive';
import { NotificationsDirective } from '../app/components/notifications/notifications.directive';
import { LoadingDirective } from '../app/components/loading/loading.directive';
import { BackgroundImageDirective } from '../app/components/backgroundImage/backgroundImage.directive';

angular.module('oerebAppV2', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'LocalStorageModule', 'toastr', 'base64', 'ngeo', 'siyfion.sfTypeahead', 'pascalprecht.translate', 'angular-carousel'])
    .constant('moment', moment)

    .config(config)
    .config(routerConfig)

    .run(runBlock)

    .service('Helpers', HelpersService)
    .service('Oereb', OerebBernService)
    .service('Layers', LayersService)
    .service('Extracts', ExtractsService)
    .service('Notifications', NotificationsService)
    .service('Loading', LoadingService)
    .service('Map', MapService)

    .controller('MainController', MainController)
    .controller('DetailController', DetailController)

    .directive('map', MapDirective)
    .directive('notifications', NotificationsDirective)
    .directive('loading', LoadingDirective)
    .directive('restriction', RestrictionDirective)
    .directive('background', BackgroundImageDirective)

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