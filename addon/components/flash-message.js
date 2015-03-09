import Ember from 'ember';

const { computed, get, on } = Ember;

export default Ember.Component.extend({
  classNames        : [ 'flashMessage', 'alert' ],
  classNameBindings : [ 'alertType' ],

  alertType: computed('flash.type', function() {
    const flashType = get(this, 'flash.type');

    return `alert-${flashType}`;
  }),

  flashType: computed('flash.type', function() {
    const flashType = get(this, 'flash.type');

    return flashType.classify();
  }),

  click() {
    this._destroyFlashMessage();
  },

  //private
  _destroyOnTeardown: on('willDestroyElement', function() {
    this._destroyFlashMessage();
  }),

  _destroyFlashMessage() {
    const flash = get(this, 'flash');

    if (flash) {
      flash.destroyMessage();
    }
  }
});
