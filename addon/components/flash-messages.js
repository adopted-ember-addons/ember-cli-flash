import Ember from 'ember';
import layout from '../templates/components/flash-messages';

const { Component } = Ember;

export default Component.extend({
  layout,

  actions: {
    close(flashMessage) {
      flashMessage.destroyMessage();
    }
  }
});
