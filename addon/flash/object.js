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
  queue: readOnly('flashService.queue'),
  totalTimeout: customComputed.add('timeout', 'extendedTimeout').readOnly(),
  timer: null,
  exitTimer: null,
  exiting: false,

  startTimer() {
    if (get(this, 'timer') || get(this, 'sticky')) {
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
    set(this, 'exiting', true);

    this._cancelTimer('exitTimer');
    this.trigger('didExitMessage');
  },

  willDestroy() {
    const timers = ['timer', 'exitTimer'];

    timers.forEach((timer) => {
      this._cancelTimer(timer);
    });

    this._super(...arguments);
  },

  // private
  _guid: customComputed.guidFor('message').readOnly(),

  _setTimer(name, methodName, timeout) {
    set(this, name, later(this, methodName, timeout));
  },

  _cancelTimer(name) {
    const timer = get(this, name);

    if (timer) {
      cancel(timer);
      set(this, name, null);
    }
  }
});
