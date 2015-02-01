import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

export function initialize(_container, application) {
  application.register('service:flash-messages', FlashMessagesService, { singleton: true });
  application.inject('controller', 'flashes', 'service:flash-messages');
  application.inject('route', 'flashes', 'service:flash-messages');
}

export default {
  name: 'flash-messages-service',
  initialize: initialize
};
