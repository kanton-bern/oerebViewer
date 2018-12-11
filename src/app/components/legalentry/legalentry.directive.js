export function LegalEntryDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        template: require('./legalentry.html'),
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
    }
}
