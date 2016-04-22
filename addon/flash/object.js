import Ember from 'ember';
import customComputed from '../utils/computed';
import computed from 'ember-new-computed';

const {
  Object: EmberObject,
  run: { later, cancel },
  Evented,
  get,
  set
} = Ember;
const {
  readOnly
} = computed;

export default EmberObject.extend(Evented, {
  timer: null,
  exitTimer: null,
  isExiting: false,

  queue: readOnly('flashService.queue'),
  totalTimeout: customComputed.add('timeout', 'extendedTimeout').readOnly(),
  _guid: customComputed.guidFor('message').readOnly(),

  init() {
    this._super(...arguments);

    if (get(this, 'sticky')) {
      return;
    }

    this._setTimer('exitTimer', 'exitMessage', get(this, 'timeout'));
    this._setTimer('timer', 'destroyMessage', get(this, 'totalTimeout'));
  },

  destroyMessage() {
    const queue = get(this, 'queue');

    if (queue) {
      queue.removeObject(this);
    }

    this.destroy();
    this.trigger('didDestroyMessage');
  },

  exitMessage() {
    set(this, 'isExiting', true);

    this._cancelTimer('exitTimer');
    this.trigger('didExitMessage');
  },

  willDestroy() {
    this._super(...arguments);
    ['timer', 'exitTimer'].forEach((timer) => this._cancelTimer(timer));
  },

  // private
  _setTimer(name, methodName, timeout) {
    return set(this, name, later(this, methodName, timeout));
  },

  _cancelTimer(name) {
    const timer = get(this, name);

    if (timer) {
      cancel(timer);
      set(this, name, null);
    }
  }
});
