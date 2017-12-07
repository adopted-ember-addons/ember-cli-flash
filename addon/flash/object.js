import Evented from '@ember/object/evented';
import EmberObject, { set, get } from '@ember/object';
import { cancel, later } from '@ember/runloop';
import customComputed from '../utils/computed';

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
    this.timerTask();
    this._setInitializedTime();
  },

  destroyMessage() {
    this._cancelTimer();
    let exitTaskInstance = get(this, 'exitTaskInstance');
    if (exitTaskInstance) {
      cancel(exitTaskInstance);
      this._teardown();
    } else {
      this.exitTimerTask();
    }
  },

  exitMessage() {
    if (!get(this, 'isExitable')) {
      return;
    }
    this.exitTimerTask();
    this.trigger('didExitMessage');
  },

  willDestroy() {
    const onDestroy = get(this, 'onDestroy');
    if (onDestroy) {
      onDestroy();
    }

    this._cancelTimer();
    this._cancelTimer('exitTaskInstance');
    this._super(...arguments);
  },

  preventExit() {
    set(this, 'isExitable', false);
  },

  allowExit() {
    set(this, 'isExitable', true);
    this._checkIfShouldExit();
  },

  timerTask() {
    let timeout = get(this, 'timeout');
    if (!timeout) {
      return;
    }
    let timerTaskInstance = later(() => {
      this.exitMessage();
    }, timeout);
    set(this, 'timerTaskInstance', timerTaskInstance);
  },

  exitTimerTask() {
    if (get(this, 'isDestroyed')) {
      return;
    }
    set(this, 'exiting', true);
    let extendedTimeout = get(this, 'extendedTimeout');
    if (extendedTimeout) {
      let exitTaskInstance = later(() => {
        this._teardown();
      }, extendedTimeout);
      set(this, 'exitTaskInstance', exitTaskInstance);
    } else {
      this._teardown();
    }
  },

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

  _cancelTimer(taskName = 'timerTaskInstance') {
    let taskInstance = get(this, taskName);
    if (taskInstance) {
      cancel(taskInstance);
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
