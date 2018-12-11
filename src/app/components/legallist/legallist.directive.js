export function LegalListDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        template: require('./legallist.html'),
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
