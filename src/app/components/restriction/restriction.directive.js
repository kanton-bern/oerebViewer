export function RestrictionDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/restriction/restriction.html',
        controller: RestrictionController,
        controllerAs: 'restriction',
        bindToController: true
    };

    return directive;
}

class RestrictionController {
    constructor(Extracts) {
        'ngInject';

        this.Extracts = Extracts;
        
        


    }
}
