export class ExtractsService {
    constructor($log, $location, Loading, Oereb, Notification, localStorageService, Helpers, $filter) {

        'ngInject';

        this.$log = $log;
        this.$filter = $filter;
        this.Helpers = Helpers;
        this.$location = $location;
        this.Loading = Loading;
        this.Oereb = Oereb;
        this.Notification = Notification;
        this.localStorageService = localStorageService;

        this.extracts = [];
        this.observers = [];
        this.restrictionObservers = [];

        // load extracts from storage if exists
        let extractsFromStorage = localStorageService.get('extracts');
        if (extractsFromStorage != null)
            this.extracts = extractsFromStorage;
    }

    reset() {
        this.extracts = [];
    }

    add(newExtract) {
        let self = this;

        this.remove(newExtract.egrid);

        this.$log.warn('extract loading: ' + newExtract.egrid);

        this.Loading.show();

        newExtract.remove = function () {
            self.remove(this.egrid);
        };

        this.Oereb.getExtractById(newExtract.egrid).then(function (d) {

            newExtract = self.wrap(newExtract, d.data);

            self.extracts.push(newExtract);

            console.log(self.extracts.length);
            while (self.extracts.length > 10)
                self.extracts.shift();

            self.setCurrent(newExtract.egrid);
            self.localStorageService.set('extracts', self.extracts);

            self.notifyCurrentObservers();

            self.Loading.hide();

            var loadSuccess1 = self.$filter('translate')('notification_loadsuccess1');
            var loadSuccess2 = self.$filter('translate')('notification_loadsuccess2');

            self.Notification.success(loadSuccess1 + ' ' + newExtract.data.RealEstate.Number + ' (' + newExtract.data.RealEstate.Municipality + ') ' + loadSuccess2);

        }).catch(function () {

            var loadFailed1 = self.$filter('translate')('notification_failed1');
            var loadFailed2 = self.$filter('translate')('notification_failed2');

            self.Notification.error(loadFailed1 + ' '  + newExtract.data.RealEstate.Number + ' (' + newExtract.data.RealEstate.Municipality + ') ' + loadFailed2);
            self.Loading.hide();
        });
    }

    wrap(newExtract, data) {
        newExtract.data = data;

        newExtract.themes = (data.ConcernedTheme instanceof Array) ? data.ConcernedTheme : [data.ConcernedTheme];
        newExtract.ncthemes = (data.NotConcernedTheme instanceof Array) ? data.NotConcernedTheme : [data.NotConcernedTheme];
        newExtract.wdthemes = (data.ThemeWithoutData instanceof Array) ? data.ThemeWithoutData : [data.ThemeWithoutData];
        newExtract.layers = [];

        let restrictions = [];
        let count = 0;
        angular.forEach(newExtract.data.RealEstate.RestrictionOnLandownership, function (d) {

            if (angular.isUndefined(d.Theme))
                return false;

            var doesRestrictionTypeExist = false;

            angular.forEach(restrictions, function (value, key) {
                if (value.code == d.Theme.Code) {
                    value.values.push(d);
                    doesRestrictionTypeExist = true;
                }
            });

            if (!doesRestrictionTypeExist) {
                var theme = {};
                theme.name = d.Theme.Name;
                theme.code = d.Theme.Code;
                theme.values = [];
                theme.values.push(d);
                theme.index = count++;

                restrictions.push(theme);
            }
        });

        newExtract.restrictions = restrictions;
        newExtract.restrictionLength = Object.keys(restrictions).length;

        return newExtract;
    }

    setCurrent(egrid) {
        let self = this;

        for (var i = 0; i < this.extracts.length; i++) {
            if (this.extracts[i].egrid == egrid) {
                self.currentExtract = self.extracts[i];
                self.notifyCurrentObservers();

            }
        }
    }

    getCurrent() {
        if (angular.isUndefined(this.currentExtract)) {
            this.currentExtract = this.extracts[0];
        }

        return this.currentExtract;
    }


    registerCurrentObserverCallback(callback) {
        this.observers.push(callback);
    }

    notifyCurrentObservers() {
        angular.forEach(this.observers, function (callback) {
            callback();
        });

        this.notifyRestrictionObservers();
    }

    setRestrictionByCode(code, notify = true) {
        this.currentRestrictionChanged = true;
        this.currentRestrictionCode = code;

        this.$location.search('restriction', code);

        if (notify)
            this.notifyRestrictionObservers();
    }

    getRestrictionByCode() {
        let result = false;
        let self = this;

        angular.forEach(this.getCurrent().restrictions, function (r) {
            if (r.code == self.currentRestrictionCode) {
                result = r;
            }
        });

        if (!result)
            this.Notification.success('{{"notification_nothemeavailable" | translate }}');

        return result;
    }

    getRestriction() {
        if (this.currentRestrictionChanged) {
            this.currentRestriction = this.getRestrictionByCode();
            this.currentRestrictionChanged = false;
        }

        if (angular.isUndefined(this.currentRestriction) || this.currentRestriction == false) {
            if (this.getCurrent().restrictions.length > 0)
                this.currentRestriction = this.getCurrent().restrictions[0];
            else
                this.currentRestriction = false;
        }

        return this.currentRestriction;
    }

    registerRestrictionObserverCallback(callback) {
        this.restrictionObservers.push(callback);
    }

    notifyRestrictionObservers() {
        angular.forEach(this.restrictionObservers, function (callback) {
            callback();
        });
    }

    count() {
        return this.extracts.length;
    }

    remove(egrid) {
        let self = this;

        for (var i = 0; i < this.extracts.length; i++) {
            if (this.extracts[i].egrid == egrid) {
                self.extracts.splice(i, 1);
            }
        }

        this.$log.warn("animation: remove" + egrid);

        return egrid;
    }

    get() {
        return this.extracts;
    }
}
