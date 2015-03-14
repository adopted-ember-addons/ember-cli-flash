import Ember from 'ember';

const { computed, getWithDefault } = Ember;

export default Ember.Component.extend({
  classNames        : [ 'flashMessage' ],
  classNameBindings : [ 'alertType' ],
  messageStyle      : undefined,

  alertType: computed('flash.type', function() {
    const flashType    = getWithDefault(this, 'flash.type', '');
    const messageStyle = getWithDefault(this, 'messageStyle', Ember.ENV.flashTheme || 'bootstrap');
    let prefix         = 'alert alert-';

    if (messageStyle === 'foundation') {
      prefix = 'alert-box ';
    }

    return `${prefix}${flashType}`;
  }),

  flashType: computed('flash.type', function() {
    const flashType = getWithDefault(this, 'flash.type', '');

    return flashType.classify();
  }),

  click() {
    this._destroyFlashMessage();
  },

  willDestroy() {
    this._destroyFlashMessage();
  },

  _destroyFlashMessage() {
    const flash = getWithDefault(this, 'flash', false);

    if (flash) {
      flash.destroyMessage();
    }
  }
});
