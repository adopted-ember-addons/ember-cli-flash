import Ember from 'ember';
import layout from '../templates/components/flash-message';
import computed from 'ember-new-computed';

const {
  String: { htmlSafe },
  run: { next, cancel },
  Component,
  getWithDefault,
  get,
  set
} = Ember;
const {
  readOnly,
  bool
} = computed;

export default Component.extend({
  layout,
  isActive: false,
  classNameBindings: ['isActive', 'isExiting'],

  type: readOnly('flash.type'),
  message: readOnly('flash.message'),
  sticky: readOnly('flash.sticky'),
  showProgressBar: readOnly('flash.showProgress'),
  isExiting: readOnly('flash.isExiting'),

  hasBlock: bool('template').readOnly(),

  progressDuration: computed('showProgressBar', {
    get() {
      if (!get(this, 'showProgressBar')) {
        return false;
      }

      const duration = getWithDefault(this, 'flash.timeout', 0);

      return htmlSafe(`transition-duration: ${duration}ms`);
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    const pendingSet = next(this, () => set(this, 'isActive', true));
    set(this, 'pendingSet', pendingSet);
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
  },

  actions: {
    close() {
      this._destroyFlashMessage();
    }
  }
});
