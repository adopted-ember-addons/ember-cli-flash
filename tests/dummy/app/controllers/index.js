import Ember from 'ember';

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  message: "Alpacas are lovely",
  timeout: 3000,

  actions: {
    fire(messageType) {
      const config = {
        destroyOnClick: true
      };
      const timeout = parseInt(this.get('timeout'));
      if (timeout) {
        config.timeout = timeout;
      }
      this.get('flashMessages')[messageType](this.get('message'), config);
    }
  }
});
