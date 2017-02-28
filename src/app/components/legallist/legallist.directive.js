export function LegalListDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/legallist/legallist.html',
        scope: {
            documents: '=',
            title: '=',
            xsitype: '=',
            entryicon: '='
        },
        controller: LegalListController,
        controllerAs: 'list',
        bindToController: true
    };

    return directive;
}

class LegalListController {
    constructor() {
        'ngInject';
    }
}
