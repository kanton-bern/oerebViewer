export function AutofocusDirective() {
    'ngInject';

    let directive = {
        restrict: 'A',
        link : function($scope, $element) {
            console.log('autofocus directive executed');
            $timeout(function() {
                $element[0].focus();
            });
        }
    };

    return directive;
}