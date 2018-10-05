/* eslint-disable ember/new-module-imports */
import Ember from 'ember';
const merge = Ember.merge || Ember.assign;

export default function(configOverrides) {
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
  return merge(addonDefaults, configOverrides);
}

