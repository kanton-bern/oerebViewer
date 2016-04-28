export class LoadingService {
    constructor() {
        'ngInject';

        this.hide();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
