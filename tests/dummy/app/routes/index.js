import Ember from 'ember';

const { get: get } = Ember;

export default Ember.Route.extend({
  activate() {
    const flashes = get(this, 'flashes');

    flashes.success('Route transitioned successfully', {
      timeout      : 50,
      priority     : 500,
      showProgress : true
    });

    flashes.warning('It is going to rain tomorrow', {
      timeout  : 50,
      priority : 1000
    });

    flashes.danger('You went offline', { sticky: true });
  }
});
