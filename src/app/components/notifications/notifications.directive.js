export function NotificationsDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/notifications/notifications.html',
        controller: NotificationsController,
        controllerAs: 'map',
        bindToController: true
    };

    return directive;
}

// use: WGS84 bzw. EPSG:4326

class NotificationsController {
    constructor() {
        'ngInject';

    }

    // restore permalink
    restore() {

    }
}
