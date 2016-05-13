export class ExtractsService {
    constructor ($log, Loading, Oereb, Notifications) {

        'ngInject';

        this.$log = $log;
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

        newExtract.remove = function() { self.remove(this.egrid); };

        this.Oereb.getExtractById(newExtract.egrid).then(function (d) {

            newExtract = self.wrap(newExtract, d.data);

            self.current = newExtract;
            self.extracts.push(newExtract);
            self.notifyCurrentObservers();

            self.Loading.hide();

            if (!angular.element("menuLeftSlider").attr('aria-expanded'))
                angular.element('#buttonShowExtract').click();

        }).catch(function() {
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

        let restrictions = {};
        angular.forEach(newExtract.data.RealEstate.RestrictionOnLandownership, function(d){

            if (angular.isUndefined(d.Theme))
                return false;

            if (!angular.isArray(restrictions[d.Theme.Code])) {
                restrictions[d.Theme.Code] = {};
                restrictions[d.Theme.Code].name = d.Theme.Name;
                restrictions[d.Theme.Code].code = d.Theme.Code;
                restrictions[d.Theme.Code].values = [];
            }

            restrictions[d.Theme.Code].values.push(d);
        });

        newExtract.restrictions = restrictions;

        return newExtract;
    }

    setCurrent(egrid) {
        let self = this;

        for(var i = 0; i < this.extracts.length; i++){
            if(this.extracts[i].egrid == egrid){
                self.currentExtract = self.extracts[i];
                self.notifyCurrentObservers();

            }
        }
    }

    current() {
        if (typeof this.currentExtract === 'undefined') {
            this.currentExtract = this.extracts[0];
        }

        this.$log.warn('Current: ');
        this.$log.warn(this.currentExtract);

        return this.currentExtract;
    }


    registerCurrentObserverCallback(callback) {
        this.observers.push(callback);
    }

    notifyCurrentObservers() {
        angular.forEach(this.observers, function(callback){
            callback();
        });

        this.notifyRestrictionObservers();
    }

    setRestriction(code) {
        this.currentRestrictionCode = code;
        this.notifyRestrictionObservers();
    }
    
    getRestriction() {
        if (angular.isUndefined(this.currentRestrictionCode))
            return false;
        return this.currentRestrictionCode;
    }
    
    registerRestrictionObserverCallback(callback) {
        this.restrictionObservers.push(callback);
    }

    notifyRestrictionObservers() {
        angular.forEach(this.restrictionObservers, function(callback){
            callback();
        });
    }

    count() {
        return this.extracts.length;
    }

    remove(egrid) {
        let self = this;

        for(var i = 0; i < this.extracts.length; i++){
            if(this.extracts[i].egrid == egrid){
                self.extracts.splice(i,1);
            }
        }

        this.$log.warn("animation: remove" + egrid);

        return egrid;
    }

    get() {
        return this.extracts;
    }
}
