import Ember from 'ember';
import config from '../config/environment';

const { merge, deprecate } = Ember;
const INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
const addonDefaults = {
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
};

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { flashMessageDefaults } = config || {};
  const { injectionFactories } = flashMessageDefaults || [];
  const options = merge(addonDefaults, flashMessageDefaults);
  const shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

  application.register('config:flash-messages', options, { instantiate: false });
  application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

  deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
    id: 'ember-cli-flash.deprecate-injection-factories',
    until: '2.0.0'
  });

  options.injectionFactories.forEach((factory) => {
    application.inject(factory, 'flashMessages', 'service:flash-messages');
  });
}

export default {
  name: 'flash-messages',
  initialize
};
