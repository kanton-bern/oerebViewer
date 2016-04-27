export class NotificationsService {
  constructor ($log) {

    'ngInject';

    this.$log = $log;
    this.notifications = [];
  }

  reset() {
    this.notifications = [];
  }

  add(notification) {
    this.notifications.push(notification);
  }
}
