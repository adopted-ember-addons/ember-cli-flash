import config from '../config/environment';
import { deprecate } from '@ember/application/deprecations';

/* eslint-disable ember/new-module-imports */
const INJECTION_FACTORIES_DEPRECATION_MESSAGE =
  '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
import flashMessageOptions from 'ember-cli-flash/utils/flash-message-options';

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { flashMessageDefaults } = config || {};
  const { injectionFactories } = flashMessageDefaults || [];
  const options = flashMessageOptions(flashMessageDefaults);
  const shouldShowDeprecation = !(
    injectionFactories && injectionFactories.length
  );

  deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
    id: 'ember-cli-flash.deprecate-injection-factories',
    until: '2.0.0',
  });

  options.injectionFactories.forEach((factory) => {
    application.inject(factory, 'flashMessages', 'service:flash-messages');
  });
}

export default {
  name: 'flash-messages',
  initialize,
};
