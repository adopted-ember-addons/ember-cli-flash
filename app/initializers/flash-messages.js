const config =  {
    flashMessageDefaults: {
      timeout: 3000,
      extendedTimeout: 0,
      priority: 100,
      sticky: false,
      showProgress: false,
      type: 'info',
      types: [
        'success',
        'info',
        'warning',
        'danger',
        'alert',
        'secondary'
      ],
      injectionFactories: [
        'route',
        'controller',
        'view',
        'component'
      ],
      preventDuplicates: false
    }
  };

export function initialize() {
  const application = arguments[1] || arguments[0];
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
