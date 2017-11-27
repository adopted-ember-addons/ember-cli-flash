import Evented from '@ember/object/evented';
import EmberObject, { set, get } from '@ember/object';
import customComputed from '../utils/computed';
import { task, timeout } from 'ember-concurrency';

export default EmberObject.extend(Evented, {
  exitTimer: null,
  exiting: false,
  isExitable: true,
  initializedTime: null,

  _guid: customComputed.guidFor('message').readOnly(),

  init() {
    this._super(...arguments);

    if (get(this, 'sticky')) {
      return;
    }
    set(this, 'timerTaskInstance', get(this, 'timerTask').perform());
    this._setInitializedTime();
  },

  destroyMessage() {
    this._cancelTimer();
    let exitTaskInstance = get(this, 'exitTaskInstance');
    if (exitTaskInstance && exitTaskInstance.isRunning) {
      exitTaskInstance.cancel();
      this._teardown();
    } else {
      set(this, 'exitTaskInstance', get(this, 'exitTimerTask').perform());
    }
  },

  exitMessage() {
    if (!get(this, 'isExitable')) {
      return;
    }
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
    if (get(this, 'timeout')) {
      yield timeout(get(this, 'timeout'));
    }
    this.exitMessage();
    this._teardown();
  }),

  exitTimerTask: task(function* () {
    set(this, 'exiting', true);
    if (get(this, 'extendedTimeout')) {
      yield timeout(get(this, 'extendedTimeout'));
    }
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
    let timerTaskInstance = get(this, 'timerTaskInstance');
    if (timerTaskInstance) {
      timerTaskInstance.cancel();
    }
  },

  _checkIfShouldExit() {
    if (this._getElapsedTime() >= get(this, 'timeout') && !get(this, 'sticky')) {
      this._cancelTimer();
      this.exitMessage();
    }
  },

  _teardown() {
    const queue = get(this, 'flashService.queue');
    if (queue) {
      queue.removeObject(this);
    }

    this.destroy();
    this.trigger('didDestroyMessage');
  }
});
