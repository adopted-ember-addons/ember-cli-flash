import Ember from 'ember';

const { get } = Ember;

export default Ember.Route.extend({
  activate() {
    const flashMessages = get(this, 'flashMessages');

    flashMessages.success('Route transitioned successfully', {
      priority: 500,
      showProgress: true,
    });

    flashMessages.success('Three second timout with a two second exit', {
      priority: 100,
      showProgress: true,
      sticky: false,
      timeout: 3000,
      extendedTimeout: 2000
    });

    flashMessages.warning('It is going to rain tomorrow', {
      priority: 1000,
      extendedTimeout: 1000
    });

    flashMessages.danger('You went offline');
  }
});
