import Ember from 'ember';
import layout from '../templates/components/flash-message';
import computed from 'ember-new-computed';

const {
  Handlebars,
  getWithDefault,
  warn,
  run,
  on,
  get,
  set,
  String: { classify },
  Handlebars: { SafeString }
} = Ember;
const {
  escapeExpression
} = Handlebars.Utils;

export default Ember.Component.extend({
  layout,
  classNameBindings: [ 'alertType', 'active', 'exiting' ],
  active: false,
  messageStyle: 'bootstrap',
  showProgressBar: computed.readOnly('flash.showProgress'),
  exiting: computed.readOnly('flash.exiting'),

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

  _setActive: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, () => {
      set(this, 'active', true);
    });
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
