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

        this.Extracts = Extracts;
        
        this.layers = [];

        let self = this;

        this.Extracts.registerRestrictionObserverCallback(function() {
            self.layers = [];

            var bbox = '';

            angular.forEach(self.Extracts.getRestriction().values, function(v) {

                bbox = self.getParameterByName('bbox', v.Map.ReferenceWMS);


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

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}
