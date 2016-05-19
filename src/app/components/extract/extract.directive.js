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
    constructor(Extracts, Helpers) {
        'ngInject';

        this.Extracts = Extracts;
        
        this.layers = [];

        let self = this;

        this.Extracts.registerRestrictionObserverCallback(function() {
            console.log('RELOADED EXTRACT');


            self.layers = [];

            var bbox = '';

            console.log(self.Extracts.getRestriction());

            angular.forEach(self.Extracts.getRestriction().values, function(v) {
                bbox = Helpers.getParameterByName('bbox', v.Map.ReferenceWMS);
                console.log('length');
                console.log(bbox.length);

                self.layers.push({
                    name: 'restriction',
                    map: v.Map.ReferenceWMS
                });
            });

            var mainLayerMap = self.Extracts.getCurrent().data.RealEstate.PlanForLandRegister.ReferenceWMS;

            if (bbox.length != 0)
                mainLayerMap = mainLayerMap.replace(/(bbox=).*?(&)/,'$1' + bbox + '$2');

            self.layers.push({
                name: 'main',
                map: mainLayerMap
            });

        });


    }
}
