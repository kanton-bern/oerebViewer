export function RestrictionDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/restriction/restriction.html',
        controller: RestrictionController,
        controllerAs: 'restriction',
        bindToController: true
    };

    return directive;
}

class RestrictionController {
    constructor(Extracts) {
        'ngInject';

        this.Extracts = Extracts;

        var self = this;
        Extracts.registerRestrictionObserverCallback(function() {
            console.log('restrictionReloadTriggered');

            // move the slider to the right position here, thats all

            console.log(self.Extracts.current.restrictions);
        });

        angular.element('restriction').foundation();


    }
}
