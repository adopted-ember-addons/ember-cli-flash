import Ember from 'ember';

const {
  Route,
  get,
  inject: { service }
} = Ember;

export default Route.extend({
  flashMessages: service(),

  activate() {
    const flashMessages = get(this, 'flashMessages');

    flashMessages.success('Route transitioned successfully', {
      priority: 500,
      showProgress: true
    });

    flashMessages.warning('It is going to rain tomorrow', {
      priority: 1000
    });

    flashMessages.danger('You went offline');
  }
});
