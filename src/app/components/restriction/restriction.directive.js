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

        this.hasLegals = false;

    }

    isArray(data) {
        return angular.isArray(data);
    }

}
