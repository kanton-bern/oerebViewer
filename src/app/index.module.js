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
import { MapDirective } from '../app/components/map/map.directive';
import { RestrictionDirective } from '../app/components/restriction/restriction.directive';
import { NotificationsDirective } from '../app/components/notifications/notifications.directive';
import { LoadingDirective } from '../app/components/loading/loading.directive';

angular.module('oerebAppV2', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr', 'base64', 'ngeo', 'siyfion.sfTypeahead', 'pascalprecht.translate', 'angular-carousel'])
    .constant('moment', moment)

    .config(config)
    .config(routerConfig)

    .run(runBlock)

    .service('Oereb', OerebBernService)
    .service('Layers', LayersService)
    .service('Extracts', ExtractsService)
    .service('Notifications', NotificationsService)
    .service('Loading', LoadingService)

    .controller('MainController', MainController)
    .controller('DetailController', DetailController)

    .directive('map', MapDirective)
    .directive('notifications', NotificationsDirective)
    .directive('loading', LoadingDirective)
    .directive('restriction', RestrictionDirective);