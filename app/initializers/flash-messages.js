import config from '../config/environment';

export function initialize(_container, application) {
  const { flashMessageDefaults } = config;
  const { injectionFactories } = flashMessageDefaults;

  application.register('config:flash-messages', flashMessageDefaults, { instantiate: false });
  application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

  injectionFactories.forEach((factory) => {
    application.inject(factory, 'flashMessages', 'service:flash-messages');
  });
}

export default {
  name: 'flash-messages',
  initialize
};
