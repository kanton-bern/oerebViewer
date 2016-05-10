export class DetailController {
    constructor($log, $translate, Extracts, $stateParams) {
        'ngInject';

        this.Extracts = Extracts;


        this.noDatas = true;
        if ($stateParams.egrid == 0) {
            this.noDatas = false;
        } else {
            this.addExtract($stateParams.egrid);
        }

        angular.element('aside').foundation();
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }
}
