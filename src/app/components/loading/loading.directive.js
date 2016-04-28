export function LoadingDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/loading/loading.html',
        controller: LoadingController,
        controllerAs: 'loading',
        bindToController: true
    };

    return directive;
}

class LoadingController {
    constructor(Loading) {
        'ngInject';

        this.Loading = Loading;
    }

    visible() {
        return this.Loading.visible;
    }

}
