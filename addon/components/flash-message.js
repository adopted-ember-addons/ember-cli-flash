import Ember from 'ember';
import layout from '../templates/components/flash-message';
import computed from 'ember-new-computed';

const {
  String: { classify, htmlSafe },
  Component,
  getWithDefault,
  warn,
  run,
  on,
  get,
  set
} = Ember;
const {
  readOnly,
  bool
} = computed;

export default Component.extend({
  layout,
  classNameBindings: ['alertType', 'active', 'exiting'],
  active: false,
  messageStyle: 'bootstrap',
  showProgressBar: readOnly('flash.showProgress'),
  exiting: readOnly('flash.exiting'),

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

    set: readOnlySet
  }),

  flashType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');

      return classify(flashType);
    },

    set: readOnlySet
  }),

  _setActive: on('didInsertElement', function() {
    run.next(this, () => {
      set(this, 'active', true);
    });
  }),

  progressDuration: computed('flash.showProgress', {
    get() {
      if (!get(this, 'flash.showProgress')) {
        return false;
      }

      const duration = getWithDefault(this, 'flash.timeout', 0);

      return htmlSafe(`transition-duration: ${duration}ms`);
    },

    set: readOnlySet
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

  hasBlock: bool('template').readOnly()
});

function readOnlySet(key, value, oldValue) {
  warn(`\`${key}\` is read only`, {
    id: `ember-cli-flash.${key}-readonly`
  });

  // Ember 1.11 does not pass `oldValue`
  return arguments.length === 3 ? oldValue : this.get(key);
}
