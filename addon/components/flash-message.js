import Ember from 'ember';
import layout from '../templates/components/flash-message';
import computed from 'ember-new-computed';

const {
  String: { classify, htmlSafe },
  Component,
  getWithDefault,
  run,
  on,
  get,
  set
} = Ember;
const {
  readOnly,
  bool
} = computed;
const {
  next,
  cancel
} = run;

export default Component.extend({
  layout,
  active: false,
  messageStyle: 'bootstrap',
  classNameBindings: ['alertType', 'active', 'exiting'],

  showProgressBar: readOnly('flash.showProgress'),
  exiting: readOnly('flash.exiting'),
  hasBlock: bool('template').readOnly(),

  alertType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');
      const messageStyle = getWithDefault(this, 'messageStyle', '');
      let prefix = 'alert alert-';

      if (messageStyle === 'foundation') {
        prefix = 'alert-box ';
      }

      return `${prefix}${flashType}`;
    }
  }),

  flashType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');

      return classify(flashType);
    }
  }),

  _setActive: on('didInsertElement', function() {
    const pendingSet = next(this, () => {
      set(this, 'active', true);
    });
    set(this, 'pendingSet', pendingSet);
  }),

  progressDuration: computed('flash.showProgress', {
    get() {
      if (!get(this, 'flash.showProgress')) {
        return false;
      }

      const duration = getWithDefault(this, 'flash.timeout', 0);

      return htmlSafe(`transition-duration: ${duration}ms`);
    }
  }),

  click() {
    this._destroyFlashMessage();
  },

  willDestroy() {
    this._super();
    this._destroyFlashMessage();
    cancel(get(this, 'pendingSet'));
  },

  // private
  _destroyFlashMessage() {
    const flash = getWithDefault(this, 'flash', false);

    if (flash) {
      flash.destroyMessage();
    }
  }
});
