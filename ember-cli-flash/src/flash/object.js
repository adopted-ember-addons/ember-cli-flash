import Evented from '@ember/object/evented';
import EmberObject, { set } from '@ember/object';
import { cancel, later } from '@ember/runloop';
import { guidFor } from '../utils/computed';
import { isTesting, macroCondition } from '@embroider/macros';

// Disable timeout by default when running tests
const defaultDisableTimeout = macroCondition(isTesting()) ? true : false;

// Note:
// To avoid https://github.com/adopted-ember-addons/ember-cli-flash/issues/341 from happening, this class can't simply be called Object
export default class FlashObject extends EmberObject.extend(Evented) {
  exitTimer = null;
  exiting = false;
  isExitable = true;
  initializedTime = null;

  // testHelperDisableTimeout – Set by `disableTimeout` and `enableTimeout` in test-support.js

  get disableTimeout() {
    return this.testHelperDisableTimeout ?? defaultDisableTimeout;
  }

  @(guidFor('message').readOnly())
  _guid;

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);

    if (this.disableTimeout || this.sticky) {
      return;
    }
    this.timerTask();
    this._setInitializedTime();
  }

  destroyMessage() {
    this._cancelTimer();
    if (this.exitTaskInstance) {
      cancel(this.exitTaskInstance);
      this._teardown();
    } else {
      this.exitTimerTask();
    }
  }

  exitMessage() {
    if (!this.isExitable) {
      return;
    }
    this.exitTimerTask();
    this.trigger('didExitMessage');
  }

  willDestroy() {
    if (this.onDestroy) {
      this.onDestroy();
    }

    this._cancelTimer();
    this._cancelTimer('exitTaskInstance');
    super.willDestroy(...arguments);
  }

  preventExit() {
    set(this, 'isExitable', false);
  }

  allowExit() {
    set(this, 'isExitable', true);
    this._checkIfShouldExit();
  }

  timerTask() {
    if (!this.timeout) {
      return;
    }
    const timerTaskInstance = later(() => {
      this.exitMessage();
    }, this.timeout);
    set(this, 'timerTaskInstance', timerTaskInstance);
  }

  exitTimerTask() {
    if (this.isDestroyed) {
      return;
    }
    set(this, 'exiting', true);
    if (this.extendedTimeout) {
      let exitTaskInstance = later(() => {
        this._teardown();
      }, this.extendedTimeout);
      set(this, 'exitTaskInstance', exitTaskInstance);
    } else {
      this._teardown();
    }
  }

  _setInitializedTime() {
    let currentTime = new Date().getTime();
    set(this, 'initializedTime', currentTime);

    return this.initializedTime;
  }

  _getElapsedTime() {
    let currentTime = new Date().getTime();

    return currentTime - this.initializedTime;
  }

  _cancelTimer(taskName = 'timerTaskInstance') {
    if (this[taskName]) {
      cancel(this[taskName]);
    }
  }

  _checkIfShouldExit() {
    if (this._getElapsedTime() >= this.timeout && !this.sticky) {
      this._cancelTimer();
      this.exitMessage();
    }
  }

  _teardown() {
    const queue = this.flashService?.queue;
    if (queue) {
      queue.removeObject(this);
    }
    this.destroy();
    this.trigger('didDestroyMessage');
  }
}
