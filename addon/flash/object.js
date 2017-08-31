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
  isExitable: true,
  initializedTime: null,

  queue: readOnly('flashService.queue'),
  _guid: customComputed.guidFor('message').readOnly(),

  init() {
    this._super(...arguments);

    if (get(this, 'sticky')) {
      return;
    }

    this._setTimer('timer', 'exitMessage', get(this, 'timeout'));
    this._setInitializedTime();
  },

  destroyMessage() {
    let extendedTimeout = get(this, 'extendedTimeout') || 0;
    return extendedTimeout ? this._delayedTeardown(extendedTimeout) : this._teardown();
  },

  exitMessage() {
    if (!get(this, 'isExitable')) {
      return;
    }
    this._setTimer('exitTimer', 'destroyMessage', get(this, 'extendedTimeout'));
    this._cancelTimer('timer');

    set(this, 'exiting', true);
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

  preventExit() {
    set(this, 'isExitable', false);
  },

  allowExit() {
    set(this, 'isExitable', true);
    this._checkIfShouldExit();
  },

  // private
  _setTimer(name, methodName, timeout) {
    return set(this, name, later(this, methodName, timeout));
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
  },

  _checkIfShouldExit() {
    if (this._getElapsedTime() >= get(this, 'timeout') && !get(this, 'sticky')) {
      this.exitMessage();
    }
  },

  _delayedTeardown(extendedTimeout) {
    set(this, 'exiting', true);
    later(() => {
      this._teardown();
    }, extendedTimeout);
  },

  _teardown() {
    const queue = get(this, 'queue');
    if (queue) {
      queue.removeObject(this);
    }

    this.destroy();
    this.trigger('didDestroyMessage');
  }
});
