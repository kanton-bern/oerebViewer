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
    constructor($location, Extracts, $scope) {
        'ngInject';

        this.Extracts = Extracts;
        this.$scope = $scope;
        
        this.slideIndex = 0;


        var self = this;

        Extracts.registerRestrictionObserverCallback(function() {
            self.slideIndex = self.Extracts.getRestriction().index;
        });


        // watch for slides
        $scope.$watch(function () {
            return self.slideIndex;
        }, function (value) {
            self.setRestrictionByIndex();
        });
    }

    next() {
        this.slideIndex = this.slideIndex+1;
        this.setRestrictionByIndex();
    }

    back() {
        this.slideIndex = this.slideIndex-1;
        this.setRestrictionByIndex();
    }

    setRestrictionByIndex() {
        if (angular.isUndefined(this.Extracts.current))
            return false;

        console.log(this.Extracts);


        this.Extracts.setRestrictionByCode(
            this.Extracts.current.restrictions[this.slideIndex].code,
            false
        );

        return true;
    }
}
