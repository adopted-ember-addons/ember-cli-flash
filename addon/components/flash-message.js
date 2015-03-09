import Ember from 'ember';

const { computed, get, on } = Ember;

export default Ember.Component.extend({
  classNames        : [ 'flashMessage' ],
  classNameBindings : [ 'alertType' ],
  messageStyle      : 'bootstrap',

  alertType: computed('flash.type', function() {
    const flashType    = get(this, 'flash.type');
    const messageStyle = get(this, 'messageStyle');
    var prefix         = 'alert alert-';

    if (messageStyle === 'foundation') {
      prefix = 'alert-box ';
    }

    return `${prefix}${flashType}`;
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
