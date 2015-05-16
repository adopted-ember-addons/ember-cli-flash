import Ember from 'ember';

const get = Ember.get;

const {
  computed,
  getWithDefault,
  warn
} = Ember;

const { classify } = Ember.String;
const { escapeExpression } = Ember.Handlebars.Utils;
const { SafeString } = Ember.Handlebars;

export default Ember.Component.extend({
  classNameBindings: [ 'alertType', 'active' ],
  active: true,
  messageStyle: 'bootstrap',
  showProgressBar: computed.readOnly('flash.showProgress'),

  alertType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');
      const messageStyle = getWithDefault(this, 'messageStyle', '');
      let prefix = 'alert alert-';

      if (messageStyle === 'foundation') {
        prefix = 'alert-box ';
      }

      return `${prefix}${flashType}`;
    },

    set() {
      warn('`alertType` is read only');

      return this;
    }
  }),

  flashType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');

      return classify(flashType);
    },

    set() {
      warn('`flashType` is read only');

      return this;
    }
  }),

  progressDuration: computed('flash.showProgress', {
    get() {
      if (!get(this, 'flash.showProgress')) {
        return false;
      }

      const duration = getWithDefault(this, 'flash.timeout', 0);
      const escapedCSS = escapeExpression(`transition-duration: ${duration}ms`);
      return new SafeString(escapedCSS);
    },

    set() {
      warn('`progressDuration` is read only');
    }
  }),

  click() {
    this._destroyFlashMessage();
  },

  willDestroy() {
    this._super();
    this._destroyFlashMessage();
  },

  // private
  _destroyFlashMessage() {
    const flash = getWithDefault(this, 'flash', false);

    if (flash) {
      flash.destroyMessage();
    }
  },

  hasBlock: computed.bool('template').readOnly()
});
