export class ExtractsService {
    constructor($log, $location, Loading, Oereb, Notifications) {

        'ngInject';

        this.$log = $log;
        this.$location = $location;
        this.Loading = Loading;
        this.Oereb = Oereb;
        this.Notifications = Notifications;

        this.extracts = [];
        this.observers = [];
        this.restrictionObservers = [];
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
            self.setCurrent(newExtract.egrid);

            self.notifyCurrentObservers();

            self.Loading.hide();

            if (!angular.element("menuLeftSlider").attr('aria-expanded'))
                angular.element('#buttonShowExtract').click();

        }).catch(function () {
            self.Notifications.add({
                message: 'Die Katasterinformationen zum Grundstück \'' + newExtract.egrid + '\' existieren in unserer Datenbank nicht.',
                type: 'alert'
            });
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

        console.log(this.getCurrent());

        angular.forEach(this.getCurrent().restrictions, function (r) {
            if (r.code == self.currentRestrictionCode) {
                result = r;
            }
        });

        return result;
    }

    getRestriction() {
        if (this.currentRestrictionChanged) {
            this.currentRestriction = this.getRestrictionByCode();
            this.currentRestrictionChanged = false;
        }

        if (angular.isUndefined(this.currentRestriction)) {
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
