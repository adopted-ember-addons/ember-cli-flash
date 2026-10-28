import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { cancel, later } from '@ember/runloop';
import { registerDestructor, isDestroyed, destroy } from '@ember/destroyable';
import { macroCondition, isTesting } from '@embroider/macros';
import { g, i } from 'decorator-transforms/runtime-esm';

// Disable timeout by default when running tests (backward compatible behavior)
const defaultDisableTimeout = macroCondition(isTesting()) ? true : false;
const INTERNAL_KEYS = new Set([
// Lifecycle callbacks — already assigned to `this` above the loop, but
// listed here as a safety net in case future refactors change that order.
'onDestroy', 'onDidDestroyMessage', 'onDidExitMessage',
// Options consumed by the constructor but not stored as class properties.
'testHelperDisableTimeout',
// Stored in a private field (#flashService), so `key in this` won't catch it.
'flashService']);
class FlashObject {
  // Static property for test helper to control timeout behavior
  // Defaults to true in test environment via @embroider/macros
  static isTimeoutDisabled = defaultDisableTimeout;

  // Note: Custom properties from T are copied at runtime in constructor
  // TypeScript sees them via FlashObject<T> & T intersection in service/component
  static {
    g(this.prototype, "exiting", [tracked], function () {
      return false;
    });
  }
  #exiting = (i(this, "exiting"), void 0);
  static {
    g(this.prototype, "message", [tracked]);
  }
  #message = (i(this, "message"), void 0); // Core properties with defaults (message is tracked for reactivity)
  type;
  priority;
  timeout;
  extendedTimeout;
  sticky;
  showProgress;
  destroyOnClick;
  preventDuplicates;

  // Internal state
  #isExitable = true;
  #initializedTime = 0;
  #timerTask;
  #exitTask;
  #flashService;

  // Callbacks (settable from outside for tests)
  onDestroy;
  onDidDestroyMessage;
  onDidExitMessage;
  get _guid() {
    const msg = this.message;
    // Handle SafeString (has toHTML) vs regular string
    const msgString = typeof msg === 'object' && msg !== null ? msg.toHTML() : String(msg);
    return guidFor(msgString);
  }
  constructor(options) {
    // Set defaults, then override with options
    this.message = options.message ?? '';
    this.type = options.type ?? 'info';
    this.priority = options.priority ?? 100;
    // Only use default timeout when explicitly provided in options
    this.timeout = options.timeout ?? 0;
    this.extendedTimeout = options.extendedTimeout ?? 0;
    this.sticky = options.sticky ?? false;
    this.showProgress = options.showProgress ?? false;
    this.destroyOnClick = options.destroyOnClick ?? true;
    this.preventDuplicates = options.preventDuplicates ?? false;

    // Store service reference and callbacks
    this.#flashService = options.flashService;
    this.onDestroy = options.onDestroy;
    this.onDidDestroyMessage = options.onDidDestroyMessage;
    this.onDidExitMessage = options.onDidExitMessage;

    // Copy any custom properties from T
    for (const [key, value] of Object.entries(options)) {
      if (!(key in this) && !INTERNAL_KEYS.has(key)) {
        this[key] = value;
      }
    }

    // Check if timeout should be disabled (static property set by test helpers)
    const shouldDisableTimeout = options.testHelperDisableTimeout ?? FlashObject.isTimeoutDisabled;
    registerDestructor(this, () => {
      this.onDestroy?.();
      this.#cancelAllTimers();
    });
    if (!shouldDisableTimeout && !this.sticky && this.timeout > 0) {
      this.#startTimer();
      this.#initializedTime = Date.now();
    }
  }

  /** Destroy this flash message immediately, triggering exit animation. */
  destroyMessage() {
    this.#cancelAllTimers();
    this.#timerTask = undefined;
    this.#exitTask = undefined;
    this.#startExitTimer();
  }

  /** Trigger the exit flow (respects isExitable). */
  exitMessage() {
    if (!this.#isExitable) return;
    this.#startExitTimer();
    this.onDidExitMessage?.();
  }

  /** Prevent the message from exiting (e.g., on mouse enter). */
  preventExit() {
    this.#isExitable = false;
  }

  /** Allow the message to exit again (e.g., on mouse leave). */
  allowExit() {
    this.#isExitable = true;
    this.#checkIfShouldExit();
  }

  /** Pause the auto-dismiss timer. */
  pauseTimer() {
    if (this.#timerTask) {
      // eslint-disable-next-line ember/no-runloop
      cancel(this.#timerTask);
      this.#timerTask = undefined;
    }
  }

  /** Resume the auto-dismiss timer with remaining time. */
  resumeTimer() {
    if (this.sticky || this.exiting || this.#timerTask) return;
    const elapsed = Date.now() - this.#initializedTime;
    const remaining = this.timeout - elapsed;
    if (remaining > 0) {
      // eslint-disable-next-line ember/no-runloop
      this.#timerTask = later(() => {
        this.#timerTask = undefined;
        this.exitMessage();
      }, remaining);
    } else {
      this.exitMessage();
    }
  }

  // Expose for component to check
  get isExitable() {
    return this.#isExitable;
  }

  // Expose for testing
  get timerTaskInstance() {
    return this.#timerTask;
  }
  #startTimer() {
    if (!this.timeout) return;

    // eslint-disable-next-line ember/no-runloop
    this.#timerTask = later(() => {
      this.#timerTask = undefined;
      this.exitMessage();
    }, this.timeout);
  }
  #startExitTimer() {
    if (isDestroyed(this)) return;
    this.exiting = true;
    if (this.extendedTimeout) {
      // eslint-disable-next-line ember/no-runloop
      this.#exitTask = later(() => this.#teardown(), this.extendedTimeout);
    } else {
      this.#teardown();
    }
  }
  #cancelAllTimers() {
    // eslint-disable-next-line ember/no-runloop
    if (this.#timerTask) cancel(this.#timerTask);
    // eslint-disable-next-line ember/no-runloop
    if (this.#exitTask) cancel(this.#exitTask);
  }
  #checkIfShouldExit() {
    const elapsed = Date.now() - this.#initializedTime;
    if (elapsed >= this.timeout && !this.sticky) {
      this.#cancelAllTimers();
      this.exitMessage();
    }
  }
  #teardown() {
    const guid = this._guid;

    // Remove from service queue
    if (this.#flashService?.queue) {
      this.#flashService.queue = this.#flashService.queue.filter(flash => flash !== this);
    }

    // Remove from guid set for duplicate tracking
    this.#flashService?.removeFromGuidSet?.(guid);
    destroy(this);
    this.onDidDestroyMessage?.();
  }
}

export { FlashObject as default };
//# sourceMappingURL=object.js.map
