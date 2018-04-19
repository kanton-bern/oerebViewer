import {EsriToken} from "./esritoken.model";

export class EsriTokenService {

    constructor() {
        'ngInject';

        this.tokens = {};
    }

    /**
     * Register new endpoint for generating an Esri Token
     *
     * @param key
     * @param options
     * @param options.username
     * @param options.password
     * @param options.auto
     */
    register(key, options = {}) {
        let token = new EsriToken(options);
        this.tokens[key] = token;
        return token
    }

    getTokeyByKey(key) {
        return this.tokens[key];
    }

}
