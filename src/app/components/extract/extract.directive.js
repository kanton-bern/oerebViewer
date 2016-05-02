export function ExtractDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/extract/extract.html',
        controller: ExtractController,
        controllerAs: 'extract',
        bindToController: true
    };

    return directive;
}

class ExtractController {
    constructor(Extracts) {
        'ngInject';

        angular.element('extract').foundation();

        this.d = Extracts.current();
        this.Extracts = Extracts;
    }

}
