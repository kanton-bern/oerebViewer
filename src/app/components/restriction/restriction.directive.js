export function RestrictionDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        template: require('./restriction.html'),
        scope: {
            data: '=',
        },
        controller: RestrictionController,
        controllerAs: 'theme',
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
