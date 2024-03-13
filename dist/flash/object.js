import { _ as _applyDecoratedDescriptor, b as _defineProperty, a as _initializerDefineProperty } from '../_rollupPluginBabelHelpers-e795903d.js';
import { cancel, later } from '@ember/runloop';
import { macroCondition, isTesting } from '@embroider/macros';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { registerDestructor, isDestroyed, destroy } from '@ember/destroyable';

var _class, _descriptor, _descriptor2;

// Disable timeout by default when running tests
const defaultDisableTimeout = macroCondition(isTesting()) ? true : false;
let FlashObject = (_class = class FlashObject {
  // testHelperDisableTimeout – Set by `disableTimeout` and `enableTimeout` in test-support.js

  get _disableTimeout() {
    return this.testHelperDisableTimeout ?? defaultDisableTimeout;
  }
  get _guid() {
    return guidFor(this.message?.toString());
  }
  constructor(messageOptions) {
    _defineProperty(this, "exitTimer", null);
    _initializerDefineProperty(this, "exiting", _descriptor, this);
    _initializerDefineProperty(this, "message", _descriptor2, this);
    _defineProperty(this, "isExitable", true);
    _defineProperty(this, "initializedTime", null);
    for (const [key, value] of Object.entries(messageOptions)) {
      this[key] = value;
    }
    registerDestructor(this, () => {
      this.onDestroy?.();
      this._cancelTimer();
      this._cancelTimer('exitTaskInstance');
    });
    if (this._disableTimeout || this.sticky) {
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
    this.onDidExitMessage?.();
  }
  preventExit() {
    this.isExitable = false;
  }
  allowExit() {
    this.isExitable = true;
    this._checkIfShouldExit();
  }
  timerTask() {
    if (!this.timeout) {
      return;
    }
    const timerTaskInstance = later(() => {
      this.exitMessage();
    }, this.timeout);
    this.timerTaskInstance = timerTaskInstance;
  }
  exitTimerTask() {
    if (isDestroyed(this)) {
      return;
    }
    this.exiting = true;
    if (this.extendedTimeout) {
      let exitTaskInstance = later(() => {
        this._teardown();
      }, this.extendedTimeout);
      this.exitTaskInstance = exitTaskInstance;
    } else {
      this._teardown();
    }
  }
  _setInitializedTime() {
    let currentTime = new Date().getTime();
    this.initializedTime = currentTime;
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
    if (this.flashService?.queue) {
      this.flashService.queue = this.flashService.queue.filter(flash => flash !== this);
    }
    destroy(this);
    this.onDidDestroyMessage?.();
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "exiting", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "message", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
})), _class);

export { FlashObject as default };
//# sourceMappingURL=object.js.map
