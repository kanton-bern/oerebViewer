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
            console.log(bbox);

            angular.forEach(self.Extracts.getRestriction().values, function(v) {
                bbox = Helpers.getParameterByName('bbox', v.Map.ReferenceWMS);

                self.layers.push({
                    name: 'restriction',
                    map: v.Map.ReferenceWMS
                });
            });

            var mainLayerMap = self.Extracts.getCurrent().data.RealEstate.PlanForLandRegister.ReferenceWMS;
            mainLayerMap = mainLayerMap.replace(/(bbox=).*?(&)/,'$1' + bbox + '$2');

            console.log(mainLayerMap);


            self.layers.push({
                name: 'main',
                map: mainLayerMap
            });

        });


    }
}
