export function RestrictionDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/restriction/restriction.html',
        scope: {
            data: '=',
        },
        controller: RestrictionController,
        controllerAs: 'restriction',
        bindToController: true
    };

    return directive;
}

class RestrictionController {
    constructor() {
        'ngInject';

        console.debug('restriction loaded');
        console.debug(this.data);

    }
}
