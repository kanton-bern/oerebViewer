export function LegalEntryDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/legalentry/legalentry.html',
        scope: {
            document: '=',
            icon: '='
        },
        controller: LegalEntryController,
        controllerAs: 'entry',
        bindToController: true
    };

    return directive;
}

class LegalEntryController {
    constructor() {
        'ngInject';

        console.debug('loaded entry');
        console.debug(this.document);
    }
}
