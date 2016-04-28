export class NotificationsService {
    constructor($log) {

        'ngInject';

        this.$log = $log;
        this.notifications = [];


        /*this.add({
            message: 'Gespeicherte Auszüge wurden als Links in die Zwischenablage kopiert',
            type: 'success'
        });

        this.add({
            message: 'Sollen alle vorhandenen Auszüge gelöscht werden',
            type: 'warning',
            buttons: [
                {
                    label: 'Ja',
                    callback: function() {
                        console.log('clicked yes');
                    }
                },
                {
                    label: 'Nein',
                    callback: function() {
                        console.log('clicked no');
                    }
                }
            ]
        });

        this.add({
            message: 'Es kann keine Datenverbindung hergestellt werden!',
            type: 'alert',
        });*/

    }

    reset() {
        this.notifications = [];
    }

    add(notification) {
        this.notifications.push(notification);
    }
}
