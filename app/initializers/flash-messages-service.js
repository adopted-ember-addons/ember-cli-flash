import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

export function initialize(_container, application) {
  application.register('service:flash-messages', FlashMessagesService, { singleton: true });

  [ 'route', 'controller', 'view', 'component' ].forEach((factory) => {
    application.inject(factory, 'flashes', 'service:flash-messages');
  });
}

export default {
  name: 'flash-messages-service',
  initialize: initialize
};
