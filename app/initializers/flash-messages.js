import Ember from 'ember';
import config from '../config/environment';

const assign = Ember.assign || Ember.merge;
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
  preventDuplicates: false
};

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { flashMessageDefaults } = config || {};
  const options = assign(addonDefaults, flashMessageDefaults);

  application.register('config:flash-messages', options, { instantiate: false });
  application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');
}

export default {
  name: 'flash-messages',
  initialize
};
