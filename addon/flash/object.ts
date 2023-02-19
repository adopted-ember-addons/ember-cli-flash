import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';
import { cancel, later } from '@ember/runloop';
import FlashMessagesService, { CustomMessageInfo } from '../services/flash-messages';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor as emberGuidFor } from '@ember/object/internals';
import { EmberRunTimer } from '@ember/runloop/types';
import classic from 'ember-classic-decorator';

// Note:
// To avoid https://github.com/adopted-ember-addons/ember-cli-flash/issues/341 from happening, this class can't simply be called Object
@classic
export default class FlashObject extends EmberObject.extend(Evented) implements CustomMessageInfo {
  @tracked exitTimer: number | null = null;
  @tracked exiting = false;
  @tracked isExitable = true;
  @tracked initializedTime: number | null = null;

  @tracked timerTaskInstance?: EmberRunTimer;
  @tracked exitTaskInstance?: EmberRunTimer;

  [x: string]: unknown;
  @tracked declare sticky: boolean;
  @tracked declare timeout: number;
  @tracked message = '';
  @tracked type?: string;
  @tracked priority?: number;
  @tracked showProgress?: boolean;
  @tracked extendedTimeout?: number;
  @tracked preventDuplicates?: boolean;

  destroyOnClick?: boolean;
  onDestroy?: () => void;

  // do not use a service injection here
  flashService?: FlashMessagesService;

  @cached
  get _guid() {
    return emberGuidFor(this.message);
  }

  init() {
    // eslint-disable-next-line prefer-rest-params
    super.init(...arguments);
    if (this.sticky) {
      return;
    }
    this.timerTask();
    this._setInitializedTime();
  }

  destroyMessage(): void {
    this._cancelTimer();
    if (this.exitTaskInstance) {
      cancel(this.exitTaskInstance);
      this._teardown();
    } else {
      this.exitTimerTask();
    }
  }

  update(options: Partial<CustomMessageInfo>) {
    Object.assign(this, options);

    if (this.sticky) {
      return;
    }

    // restart the timer
    this._cancelTimer();
    this.timerTask();
    this._setInitializedTime();
  }

  exitMessage(): void {
    if (!this.isExitable) {
      return;
    }
    this.exitTimerTask();
    this.trigger('didExitMessage');
  }

  willDestroy(): void {
    if (this.onDestroy) {
      this.onDestroy();
    }

    this._cancelTimer();
    this._cancelTimer('exitTaskInstance');
    super.willDestroy();
  }

  preventExit(): void {
    this.isExitable = false;
  }

  allowExit(): void {
    this.isExitable = true;
    this._checkIfShouldExit();
  }

  timerTask(): void {
    if (!this.timeout) {
      return;
    }
    this.timerTaskInstance = later(() => {
      this.exitMessage();
    }, this.timeout);
  }

  exitTimerTask(): void {
    if (this.isDestroyed) {
      return;
    }
    this.exiting = true;
    if (this.extendedTimeout) {
      this.exitTaskInstance = later(() => {
        this._teardown();
      }, this.extendedTimeout);
    } else {
      this._teardown();
    }
  }

  _setInitializedTime(): number | null {
    this.initializedTime = new Date().getTime();

    return this.initializedTime;
  }

  _getElapsedTime() {
    const currentTime = new Date().getTime();

    return currentTime - (this.initializedTime ?? 0);
  }

  _cancelTimer(taskName = 'timerTaskInstance') {
    if (this[taskName]) {
      cancel(this[taskName] as EmberRunTimer);
    }
  }

  _checkIfShouldExit() {
    if (this._getElapsedTime() >= this.timeout && !this.sticky) {
      this._cancelTimer();
      this.exitMessage();
    }
  }

  _teardown() {
    this.flashService?.removeFromQueue(this);

    this.destroy();
    this.trigger('didDestroyMessage');
  }
}
