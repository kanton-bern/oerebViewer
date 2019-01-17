export class EsriToken {

    /**
     * @param options
     * @param options.endpoint {string} url to endpoint
     * @param options.username
     * @param options.password
     * @param options.auto {boolean} periodically refresh token
     * @param options.interval {number} refresh interval in min
     * @param options.variation {number} refresh interval variation in sec
     */
    constructor(options = {}) {
        this.listeners = []; // update listeners
        this.onceListeners = []; // update once listeners

        this.token = null;
        this.expires = null;
        this.lastUpdate = 0;

        this.endpoint = options.endpoint;
        this.username = options.username;
        this.password = options.password;
        this.auto = options.auto !== false;
        this.interval = options.interval !== undefined ? options.interval : 5; // in min
        this.variation = options.variation !== undefined ? options.variation : 30; // in sec

        this.refreshId = null;
        if (this.auto) {
            this.fetchToken()
                .catch((err) => console.error(err));
        }
    }

    fetchToken() {
        // reshedule fetch
        if (this.auto) {
            this.scheduleRefresh();
        }

        let formData = new URLSearchParams();
        formData.append('username', this.username);
        formData.append('password', this.password);
        /*formData.append('client', 'referer');
        formData.append('referer', location.href.replace(location.hash,""));*/
        formData.append('expiration', this.interval);
        formData.append('f', 'json');

        return fetch(this.endpoint, {
            method: 'POST',
            body: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then(this.handleResponse.bind(this))
    }

    handleResponse(token) {
        if (token) {
            if (token.error) {
                console.error('Failed fetching token from ' + this.endpoint);
                this.token = null;
                this.expires = null;
                return;
            }

            this.lastUpdate = Date.now();
            this.token = token.token;
            this.expires = token.expires;
            this.triggerUpdate();
            return this.token;
        }
        return Promise.reject(new Error('Expected token as response'));
    }

    /**
     * calc random interval for next refresh
     * @returns {number} interval in ms
     */
    nextInterval() {
        return Math.max(1, (this.interval * 60 - Math.random() * this.variation)) * 1000; // in ms
    }

    scheduleRefresh() {
        if (this.refreshId) {
            clearTimeout(this.refreshId);
        }

        this.refreshId = setTimeout(() => {
            this.refreshId = null;
            this.fetchToken()
        }, this.nextInterval())
    }

    onUpdate(listener) {
        this.listeners.push(listener);
    }

    onUpdateOnce(listener) {
        this.onceListeners.push(listener);
    }

    offUpdate() {
        this.listeners = [];
        this.onceListeners = [];
    }

    triggerUpdate() {
        let notify = (listener) => {
            try {
                listener(this.token);
            } catch (err) {
                console.error('Error in EventListener:', err);
            }
        };

        this.listeners.forEach(notify);
        this.onceListeners.forEach(notify);
        this.onceListeners = [];
    }

    sinceUpdate() {
        return Date.now() - this.lastUpdate;
    }
}
