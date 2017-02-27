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
        this.hasRestrictionLegals = false;
        this.hasReferences = false;
    }

    isArray(data) {
        return angular.isArray(data);
    }

}
