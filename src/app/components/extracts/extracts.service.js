export class ExtractsService {
    constructor($location, Loading, OEREB, Notification, localStorageService, Helpers, $filter) {

        'ngInject';

        this.$filter = $filter;
        this.Helpers = Helpers;
        this.$location = $location;
        this.Loading = Loading;
        this.OEREB = OEREB;
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

    reload() {
        this.add(this.getCurrent(), true);
    }

    add(newExtract, reloading) {
        reloading = reloading || false;

        let self = this;

        // if it's a reloading skip the first one
        this.remove(newExtract.egrid);

        this.Loading.show();

        newExtract.remove = function () {
            self.remove(this.egrid);
        };

        this.OEREB.getExtractById(newExtract.egrid).then(function (d) {
            if (d.status == 204)
                throw d;

            // Dump JSON-object to console
            //console.debug('extract');
            //console.debug(newExtract);

            newExtract = self.wrap(newExtract, d.data);

            self.extracts.push(newExtract);

            while (self.extracts.length > 10)
                self.extracts.shift();

            self.setCurrent(newExtract.egrid, reloading);
            self.localStorageService.set('extracts', self.extracts);

            // self.notifyCurrentObservers(reloading);

            self.Loading.hide();

            if (!reloading) {
                // now lets remove the second one in silent
                let loadSuccess1 = self.$filter('translate')('notification_loadsuccess1');
                let loadSuccess2 = self.$filter('translate')('notification_loadsuccess2');

                self.Notification.success(loadSuccess1 + ' ' + newExtract.data.RealEstate.Number + ' (' + newExtract.data.RealEstate.Municipality + ') ' + loadSuccess2);
            }

        }).catch(function (data) {

            if (data.status == 204) {
                self.Notification.error(self.$filter('translate')('oerebService204'));
            } else {
                let loadFailed1 = self.$filter('translate')('notification_failed1');
                let loadFailed2 = self.$filter('translate')('notification_failed2');
                self.Notification.error(loadFailed1 + ' ' + newExtract.data.RealEstate.Number + ' (' + newExtract.data.RealEstate.Municipality + ') ' + loadFailed2);
            }


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


        let restrictionArray = newExtract.data.RealEstate.RestrictionOnLandownership;

        // checks if there is only one restriction
        if (angular.isDefined(restrictionArray) && angular.isDefined(restrictionArray.SubTheme)) {
            restrictionArray = [];
            restrictionArray.push(newExtract.data.RealEstate.RestrictionOnLandownership);
        }


        angular.forEach(restrictionArray, function (d) {

            if (angular.isUndefined(d.SubTheme))
                return false;



            // legalProvisions must be an array
             if (!angular.isArray(d.LegalProvisions)) {
                 let legalProvision = d.LegalProvisions;
                 d.LegalProvisions = [];
                 d.LegalProvisions.push(legalProvision);
             }

             // filter for legalProvisions without Links
             /*d.LegalProvisions = d.LegalProvisions.filter(function(legalProvision) {
                return legalProvision.TextAtWeb.LocalisedText.Text.length > 0;
             })*/;



            // if subtheme and theme.name are not identical then it's a restriction with a hierarchy
            let complex = (d.SubTheme != d.Theme.Name);

            // check if restriction type allready exists - if yes, lets just push it as a value and skip the rest
            let doesRestrictionTypeExist = false;

            angular.forEach(restrictions, function (value, key) {
                if (value.code == d.SubTheme) {
                    value.values.push(d);
                    doesRestrictionTypeExist = true;
                }
            });

            if (complex) {
                let doesRestrictionParentTypeExist = false;

                angular.forEach(restrictions, function (value, key) {
                    if (value.code == d.Theme.Code) {
                        doesRestrictionParentTypeExist = true;
                    }
                });

                // create a new parent theme
                if (!doesRestrictionParentTypeExist) {
                    let theme = {};
                    theme.name = d.Theme.Name;
                    theme.code = d.Theme.Code;
                    theme.complex = complex;
                    theme.hasChildren = true;
                    theme.values = []; // empty!
                    theme.index = count++;

                    restrictions.push(theme);
                }
            }

            if (!doesRestrictionTypeExist) {
                let theme = {};
                theme.name = d.SubTheme;
                theme.code = d.SubTheme;
                theme.parent = d.Theme.Name;
                theme.complex = complex;
                theme.hasChildren = false;
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

    setCurrent(egrid, reloading = false) {
        let self = this;
        let foundOne = false;

        for (let i = 0; i < this.extracts.length; i++) {
            if (self.extracts[i].egrid == egrid) {
                if (!foundOne) {
                    self.currentExtract = self.extracts[i];
                    foundOne = true;
                } else {
                    self.extracts.splice(i, 1);
                }
            }
        }

        self.notifyCurrentObservers(reloading);
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

    notifyCurrentObservers(reloading = false) {
        angular.forEach(this.observers, function (callback) {
            callback(reloading);
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
        let current = this.getCurrent();

        if (angular.isUndefined(current))
            return result;

        angular.forEach(current.restrictions, function (r) {
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

    remove(egrid, skip) {
        skip = skip || false;

        let self = this;

        for (let i = 0; i < this.extracts.length; i++) {
            if (this.extracts[i].egrid == egrid) {

                if (!skip)
                    self.extracts.splice(i, 1);
                skip = false;
            }

        }

        return egrid;
    }

    get() {
        return this.extracts;
    }
}
