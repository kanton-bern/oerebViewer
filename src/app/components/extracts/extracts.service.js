export class ExtractsService {
    constructor ($log, Loading, Oereb, Notifications) {

        'ngInject';

        this.$log = $log;
        this.Loading = Loading;
        this.Oereb = Oereb;
        this.Notifications = Notifications;

        this.extracts = [];
        this.observers = [];
    }

    reset() {
        this.extracts = [];
    }

    add(newExtract) {
        let self = this;
        
        this.$log.warn('extract loading: ' + newExtract.egrid);

        this.Loading.show();

        newExtract.remove = function() { self.remove(this.egrid); };

        this.Oereb.getExtractById(newExtract.egrid).then(function (d) {
            newExtract.data = d.data;

            newExtract.themes = (d.data.ConcernedTheme instanceof Array) ? d.data.ConcernedTheme : [d.data.ConcernedTheme];
            newExtract.ncthemes = (d.data.NotConcernedTheme instanceof Array) ? d.data.NotConcernedTheme : [d.data.NotConcernedTheme];
            newExtract.wdthemes = (d.data.ThemeWithoutData instanceof Array) ? d.data.ThemeWithoutData : [d.data.ThemeWithoutData];

            self.current = newExtract;
            self.extracts.push(newExtract);
            self.notifyCurrentObservers();


            self.Loading.hide();
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
