export class DetailController {
    constructor($log, $translate, Extracts, $stateParams) {
        'ngInject';

        this.Extracts = Extracts;

        this.initial = false;
        if ($stateParams.egrid == 0) {
            this.initial = true;
        } else {
            this.addExtract($stateParams.egrid);
        }

        angular.element(document).foundation();
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }
}
