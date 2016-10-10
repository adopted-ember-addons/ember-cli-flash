import Ember from 'ember';
import customComputed from '../utils/computed';

const {
  Object: EmberObject,
  computed: { readOnly },
  run: { later, cancel },
  Evented,
  get,
  set
} = Ember;

export default EmberObject.extend(Evented, {
  timer: null,
  exitTimer: null,
  exiting: false,
  initializedTime: null,

  queue: readOnly('flashService.queue'),
  totalTimeout: customComputed.add('timeout', 'extendedTimeout').readOnly(),
  _guid: customComputed.guidFor('message').readOnly(),

  init() {
    this._super(...arguments);

    if (get(this, 'sticky')) {
      return;
    }

    this._setupTimers();
    this._setInitializedTime();
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
    this._cancelAllTimers();

    const onDestroy = get(this, 'onDestroy');

    if (onDestroy) {
      onDestroy();
    }

    this._super(...arguments);
  },

  deferTimers() {
    if (get(this, 'sticky')) {
      return;
    }
    let timeout = get(this, 'timeout');
    let remainingTime = timeout - this._getElapsedTime();
    set(this, 'timeout', remainingTime);

    this._cancelAllTimers();
  },

  resumeTimers() {
    if (get(this, 'sticky')) {
      return;
    }
    this._setupTimers();
  },

  // private
  _setTimer(name, methodName, timeout) {
    return set(this, name, later(this, methodName, timeout));
  },

  _setupTimers() {
    this._setTimer('exitTimer', 'exitMessage', get(this, 'timeout'));
    this._setTimer('timer', 'destroyMessage', get(this, 'totalTimeout'));
  },

  _setInitializedTime() {
    let currentTime = new Date().getTime();

    set(this, 'initializedTime', currentTime);
  },

  _getElapsedTime() {
    let currentTime = new Date().getTime();
    let initializedTime = get(this, 'initializedTime');

    return currentTime - initializedTime;
  },

  _cancelTimer(name) {
    const timer = get(this, name);

    if (timer) {
      cancel(timer);
      set(this, name, null);
    }
  },

  _cancelAllTimers() {
    const timers = ['timer', 'exitTimer'];

    timers.forEach((timer) => {
      this._cancelTimer(timer);
    });
  }
});
