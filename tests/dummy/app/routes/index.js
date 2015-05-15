import Ember from 'ember';

const get = Ember.get;

export default Ember.Route.extend({
  activate() {
    const flashMessages = get(this, 'flashMessages');

    flashMessages.success('Route transitioned successfully', {
      priority: 500,
      showProgress: true,
      sticky: false
    });

    flashMessages.warning('It is going to rain tomorrow', {
      priority: 1000,
      sticky: false
    });

    flashMessages.danger('You went offline', {
      sticky: true
    });
  }
});
