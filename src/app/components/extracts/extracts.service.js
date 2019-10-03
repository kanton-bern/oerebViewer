export class ExtractsService {
    constructor($location, Loading, OEREB, Notification, localStorageService, Helpers, $filter, $translate, Config) {

        'ngInject';

        this.$filter = $filter;
        this.Helpers = Helpers;
        this.$location = $location;
        this.$translate = $translate;
        this.Loading = Loading;
        this.OEREB = OEREB;
        this.Notification = Notification;
        this.localStorageService = localStorageService;
        this.Config = Config;

        this.extracts = [];
        this.observers = [];
        this.restrictionObservers = [];

        // load extracts from storage if exists
        let extractsFromStorage = localStorageService.get('extracts');
        if (extractsFromStorage !== null)
            this.extracts = extractsFromStorage;
    }

    reset() {
        this.extracts = [];
    }

    reload() {
        let currentExtract = this.getCurrent()
        if (currentExtract) {
            this.add(currentExtract, true);
        }
    }

    add(newExtract, reloading = false) {
        if (typeof newExtract === 'string') {
            newExtract = {
                egrid: newExtract
            };
        }

        // if it's a reloading skip the first one
        this.remove(newExtract.egrid);

        this.Loading.show();

        newExtract.remove = function () {
            this.remove(this.egrid);
        };

        this.OEREB.getExtractById(newExtract.egrid).then((response) => {
            if (response.status === 204) {
                throw "No Content";
            }

            newExtract = this.wrap(newExtract, response.data);

            this.extracts.push(newExtract);

            while (this.extracts.length > 10) {
                this.extracts.shift();
            }

            this.setCurrent(newExtract.egrid, reloading);
            this.localStorageService.set('extracts', this.extracts);

            this.Loading.hide();

            if (!reloading) {
                let loadSuccess1 = this.$filter('translate')('notification_loadsuccess1');
                let loadSuccess2 = this.$filter('translate')('notification_loadsuccess2');

                this.Notification.success(loadSuccess1 + ' ' + newExtract.RealEstate.Number + ' (' + newExtract.RealEstate.Municipality + ') ' + loadSuccess2);
            }

            setTimeout(() => {
                this.Helpers.openMenu();
            }, 800);

        }).catch((data) => {

            console.error('whoops', data)

            if (data.status === 204) {
                this.Notification.error(this.$filter('translate')('oerebService204'));
            } else {
                let loadFailed1 = this.$filter('translate')('notification_failed1');
                let loadFailed2 = this.$filter('translate')('notification_failed2');
                this.Notification.error(loadFailed1 + ' ' + newExtract.RealEstate.Number + ' (' + newExtract.RealEstate.Municipality + ') ' + loadFailed2);
            }

            this.Loading.hide();
        });
    }

    groupBy(xs, key) {
        // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
        return xs.reduce(function (rv, x) { let v = key instanceof Function ? key(x) : x[key]; let el = rv.find((r) => r && r.key === v); if (el) { el.values.push(x); } else { rv.push({ key: v, values: [x] }); } return rv; }, []);
    }

    wrap(newExtract, data) {
        Object.assign(newExtract, data);

        newExtract.layers = [];

        let allRestrictions = newExtract.RealEstate.RestrictionOnLandownership;

        // loop all concerned themes and get their restrictions
        newExtract.ConcernedTheme.map((theme) => {
            let restrictions = allRestrictions.filter(restriction => {
                return restriction.Theme.Code === theme.Code;
            });

            // check if the given theme has subthemes
            let hasChildren = restrictions.some(restriction => restriction.SubTheme);

            restrictions = this.combineByTypeCode(restrictions);
            restrictions = this.orderLandUsePlans(restrictions, theme);

            if (! hasChildren) {
                return Object.assign(theme, {
                    values: restrictions,
                    hasChildren: false,
                });
            }

            return Object.assign(theme, {
                SubThemes: this.groupBy(restrictions, restriction => restriction.SubTheme),
                hasChildren: true,
            });

        });

        return newExtract;
    }

    combineByTypeCode(restrictions) {
        return Object.values(restrictions.reduce((acc, restriction) => {
            if (! acc[restriction.TypeCode]) {
                acc[restriction.TypeCode] = restriction;
                return acc;
            }

            const accumulation = acc[restriction.TypeCode];

            if (accumulation.NrOfPoints) {
                accumulation.NrOfPoints += restriction.NrOfPoints
            }
            if (accumulation.PartInPercent) {
                accumulation.PartInPercent += restriction.PartInPercent
            }
            if (accumulation.AreaShare) {
                accumulation.AreaShare += restriction.AreaShare
            }
            if (accumulation.LengthShare) {
                accumulation.LengthShare += restriction.LengthShare
            }

            const combineList = function (listName, equalOperator) {
                if (!accumulation.hasOwnProperty(listName) || !restriction.hasOwnProperty(listName)) {
                    return;
                }

                restriction[listName].forEach(listItem => {
                    if (!accumulation[listName].find(compareItem => equalOperator(compareItem, listItem))) {
                        accumulation[listName].push(listItem)
                    }
                });
            };

            combineList('LegalProvisions', (a, b) => {
                return a.TextAtWeb[0].Text === b.TextAtWeb[0].Text &&
                    a.Title[0].Text === b.Title[0].Text &&
                    a.DocumentType === b.DocumentType;
            });

            return acc;
        }, {}));
    }

    orderLandUsePlans(restrictions, theme) {
        if (theme.Code !== 'LandUsePlans') {
            return restrictions;
        }

        const lang = this.$translate.use() !== undefined ? this.$translate.use() : this.$translate.proposedLanguage();
        const customSortList = this.Config.customSortList.map(pair => pair[lang]).reverse()

        const getPos = function (restriction) {
            return customSortList.indexOf(restriction.SubTheme)
        };

        return restrictions.sort((a, b) => {
            return getPos(b) - getPos(a)
        })
    }

    setCurrent(egrid, reloading = false) {
        let self = this;
        let foundOne = false;

        for (let i = 0; i < this.extracts.length; i++) {
            if (self.extracts[i].egrid === egrid) {
                if (!foundOne) {
                    self.currentExtract = self.extracts[i];
                    foundOne = true;
                } else {
                    self.extracts.splice(i, 1);
                }
            }
        }

        // ie fix
        setTimeout(() => {
            this.notifyCurrentObservers(reloading);
        }, 1);
    }

    getCurrent() {
        return this.currentExtract;
    }


    registerCurrentObserverCallback(callback) {
        this.observers.push(callback);
    }

    notifyCurrentObservers(reloading = false) {
        this.observers.forEach((callback) => {
            callback(reloading);
        });

        this.notifyRestrictionObservers();
    }

    setRestrictionByCode(code, notify = true) {
        this.currentRestrictionChanged = true;
        this.currentRestrictionCode = code;

        this.$location.search('restriction', code);

        if (notify) {
            this.notifyRestrictionObservers();
        }
    }

    getRestrictionByCode() {
        let result = false;
        let self = this;
        let current = this.getCurrent();

        if (angular.isUndefined(current)) {
            return result;
        }

        current.ConcernedTheme.forEach((theme) => {
            if (theme.Code == this.currentRestrictionCode) {
                result = theme;
                return;
            }

            if (theme.hasChildren) {
                theme.SubThemes.forEach((subTheme) => {
                    if (subTheme.key == this.currentRestrictionCode) {
                        result = subTheme;
                        return;
                    }
                })
            }
        })

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
        angular.forEach(this.restrictionObservers, (callback) => {
            callback(this.currentRestrictionCode);
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
