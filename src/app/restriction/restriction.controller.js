export class RestrictionController {
    constructor($log, $translate, Extracts, $stateParams) {
        'ngInject';

        this.Extracts = Extracts;

        console.log('loaded restriction');
        console.log($stateParams.restriction);

    }
}
