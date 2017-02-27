export function MobileClickDirective() {
    'ngInject';

    return function (scope, elem, attrs) {
        elem.bind("touchstart click", function (e) {

            e.preventDefault();
            e.stopPropagation();

            scope.$apply(attrs["ngMobileClick"]);
        });
    }
};
