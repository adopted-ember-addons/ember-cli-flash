/* eslint-disable ember/no-runloop */
import { cancel, later } from '@ember/runloop';
import { isTesting, macroCondition } from '@embroider/macros';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { destroy, isDestroyed, registerDestructor } from '@ember/destroyable';

import type { Timer } from '@ember/runloop';
import type FlashMessagesService from '../services/flash-messages.ts';

export interface MessageOptions {
  message?: string;
  type?: string;
  types?: string[];
  priority?: number;
  timeout?: number;
  sticky?: boolean;
  showProgress?: boolean;
  extendedTimeout?: number;
  destroyOnClick?: boolean;
  preventDuplicates?: boolean;
  onDestroy?: () => void;
}

// Disable timeout by default when running tests
const defaultDisableTimeout = macroCondition(isTesting()) ? true : false;

export default class FlashObject {
  [x: string]: any;
  declare flashService: FlashMessagesService;

  @tracked exiting = false;
  @tracked message = '';

  exitTimer = null;
  isExitable = true;
  initializedTime: number = 0;

  // testHelperDisableTimeout – Set by `disableTimeout` and `enableTimeout` in test-support.js
  testHelperDisableTimeout = false;
  type: string = 'info';
  priority: number = 100;
  extendedTimeout: number = 0;
  sticky = false;
  showProgress = true;
  destroyOnClick = true;
  timeout: number = 3000;
  preventDuplicates: boolean = false;
  exitTaskInstance: Timer | null = null;
  timerTaskInstance: Timer | null = null;

  get #disableTimeout() {
    return this.testHelperDisableTimeout ?? defaultDisableTimeout;
  }

  get guid() {
    return guidFor(this.message?.toString());
  }

  constructor(messageOptions: MessageOptions) {
    for (const [key, value] of Object.entries(messageOptions)) {
      this[key] = value;
    }

    registerDestructor(this, () => {
      this['onDestroy']?.();

      this.#cancelTimer();
      this.#cancelTimer('exitTaskInstance');
    });

    if (this.#disableTimeout || this.sticky) {
      return;
    }

    this.timerTask();
    this.#setInitializedTime();
  }

  destroyMessage() {
    this.#cancelTimer();
    if (this.exitTaskInstance) {
      cancel(this.exitTaskInstance);
      this.#teardown();
    } else {
      this.exitTimerTask();
    }
  }

  exitMessage() {
    if (!this.isExitable) {
      return;
    }
    this.exitTimerTask();
    this['onDidExitMessage']?.();
  }

  preventExit() {
    this.isExitable = false;
  }

  allowExit() {
    this.isExitable = true;
    this.#checkIfShouldExit();
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
      const exitTaskInstance = later(() => {
        this.#teardown();
      }, this.extendedTimeout);
      this.exitTaskInstance = exitTaskInstance;
    } else {
      this.#teardown();
    }
  }

  #setInitializedTime() {
    const currentTime = new Date().getTime();
    this.initializedTime = currentTime;

    return this.initializedTime;
  }

  #getElapsedTime() {
    const currentTime = new Date().getTime();

    return currentTime - this.initializedTime;
  }

  #cancelTimer(
    taskName: 'timerTaskInstance' | 'exitTaskInstance' = 'timerTaskInstance',
  ) {
    if (this[taskName]) {
      cancel(this[taskName]);
    }
  }

  #checkIfShouldExit() {
    if (this.#getElapsedTime() >= this.timeout && !this.sticky) {
      this.#cancelTimer();
      this.exitMessage();
    }
  }

  #teardown() {
    if (this.flashService?.queue) {
      this.flashService.queue = this.flashService.queue.filter(
        (flash) => flash !== this,
      );
    }
    destroy(this);
    this['onDidDestroyMessage']?.();
  }
}
