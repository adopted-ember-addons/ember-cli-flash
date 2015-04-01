import Ember from 'ember';

const {
  computed,
  getWithDefault,
  get: get,
  set: set,
  on,
  run
} = Ember;

const { escapeExpression } = Ember.Handlebars.Utils;
const { SafeString }       = Ember.Handlebars;

export default Ember.Component.extend({
  classNameBindings : [ 'alertType', 'active' ],
  messageStyle      : 'bootstrap',
  showProgressBar   : computed.alias('flash.showProgress'),

  alertType: computed('flash.type', function() {
    const flashType    = getWithDefault(this, 'flash.type', '');
    const messageStyle = getWithDefault(this, 'messageStyle', '');
    let prefix         = 'alert alert-';

    if (messageStyle === 'foundation') {
      prefix = 'alert-box ';
    }

    return `${prefix}${flashType}`;
  }),

  flashType: computed('flash.type', function() {
    const classify  = Ember.String.classify;
    const flashType = getWithDefault(this, 'flash.type', '');

    return classify(flashType);
  }),

  progressDuration: computed('flash.showProgress', function() {
    if (!get(this, 'flash.showProgress')) {
      return false;
    }

    const duration   = getWithDefault(this, 'flash.timeout', 0);
    const escapedCSS = escapeExpression(`transition-duration: ${duration}ms`);
    return new SafeString(escapedCSS);
  }),

  click() {
    this._destroyFlashMessage();
  },

  willDestroy() {
    this._destroyFlashMessage();
  },

  // private
  _destroyFlashMessage() {
    const flash = getWithDefault(this, 'flash', false);

    if (flash) {
      flash.destroyMessage();
    }
  },

  _activeAfterRender: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, () => {
      set(this, 'active', true);
    });
  })
});
