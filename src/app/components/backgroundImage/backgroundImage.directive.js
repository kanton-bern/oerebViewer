export function BackgroundImageDirective() {
    'ngInject';

    return function (scope, element, attrs) {
        var url = attrs.background;
        element.css({
            'background-image': 'url(' + url + ')'
        });
    };
}