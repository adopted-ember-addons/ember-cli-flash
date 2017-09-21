import Ember from 'ember';
import customComputed from '../utils/computed';
import { task, timeout } from 'ember-concurrency';

const {
  Object: EmberObject,
  computed: { readOnly },
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
    let timerTaskInstance = get(this, 'timerTask');
    timerTaskInstance.perform();
    set(this, 'timerTaskInstance', timerTaskInstance)
    this._setInitializedTime();
  },

  destroyMessage() {
    let exitTaskInstance = get(this, 'exitTaskInstance');
    if (exitTaskInstance && exitTaskInstance.isRunning) {
      exitTaskInstance.cancel();
      this._teardown();
    } else {
      get(this, 'delayedTeardownTask').perform();
    }
  },

  exitMessage() {
    if (!get(this, 'isExitable')) {
      return;
    }
    this._cancelTimer();
    let exitTaskInstance = get(this, 'exitTimerTask').perform();
    set(this, 'exitTaskInstance', exitTaskInstance);
    this.trigger('didExitMessage');
  },

  willDestroy() {
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

  timerTask: task(function* () {
    yield timeout(get(this, 'timeout'));
    this.exitMessage();
  }),

  exitTimerTask: task(function* () {
    set(this, 'exiting', true);
    yield timeout(get(this, 'extendedTimeout') || 0);
    this._teardown();
  }),

  delayedTeardownTask: task(function* () {
    set(this, 'exiting', true);
    yield timeout(get(this, 'extendedTimeout'));
    this._teardown();
  }),

  // private
  _setInitializedTime() {
    let currentTime = new Date().getTime();

    set(this, 'initializedTime', currentTime);
  },

  _getElapsedTime() {
    let currentTime = new Date().getTime();
    let initializedTime = get(this, 'initializedTime');

    return currentTime - initializedTime;
  },

  _cancelTimer() {
    let timerInstance = get(this, 'timerInstance');
    if (timerInstance) {
      timerInstance.cancel();
    }
  },

  _checkIfShouldExit() {
    if (this._getElapsedTime() >= get(this, 'timeout') && !get(this, 'sticky')) {
      this.exitMessage();
    }
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
