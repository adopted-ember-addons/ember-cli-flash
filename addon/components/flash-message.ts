import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { classify } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { cancel, next } from '@ember/runloop';
import { action } from '@ember/object';
import FlashObject from 'ember-cli-flash/flash/object';
import { EmberRunTimer } from '@ember/runloop/types';

export interface FlashMessageSignature {
  Element: HTMLDivElement;
  Args: {
    flash: FlashObject;
    messageStyle?: 'bootstrap' | 'foundation';
    messageStylePrefix?: string;
  };
  Blocks: {
    default: [FlashMessage, FlashObject, (...args: never[]) => unknown];
  };
}

export default class FlashMessage extends Component<FlashMessageSignature> {
  @tracked active = false;

  @tracked declare pendingSet: EmberRunTimer;
  @tracked declare _mouseEnterHandler: (this: HTMLElement, ev: MouseEvent) => unknown;
  @tracked declare _mouseLeaveHandler: (this: HTMLElement, ev: MouseEvent) => unknown;

  get messageStyle() {
    return this.args.messageStyle ?? 'bootstrap';
  }

  get showProgress() {
    return this.args.flash.showProgress;
  }

  get notExiting() {
    return !this.exiting;
  }

  get showProgressBar() {
    return this.showProgress && this.notExiting;
  }

  get exiting() {
    return this.args.flash.exiting;
  }

  get messageStylePrefix() {
    return this.args.messageStylePrefix ?? this._defaultMessageStylePrefix;
  }

  get _defaultMessageStylePrefix() {
    const isFoundation = this.messageStyle === 'foundation';
    return isFoundation ? 'alert-box ' : 'alert alert-';
  }

  get alertType() {
    const flashType = this.args.flash.type || '';
    const prefix = this.messageStylePrefix;
    return `${prefix}${flashType}`;
  }

  get flashType() {
    return classify(this.args.flash.type || '');
  }

  get progressDuration() {
    if (!this.args.flash?.showProgress) {
      return false;
    }
    const duration = this.args.flash?.timeout || 0;
    return htmlSafe(`transition-duration: ${duration}ms`);
  }

  @action
  _mouseEnter() {
    if (isPresent(this.args.flash)) {
      this.args.flash.preventExit();
    }
  }

  @action
  _mouseLeave() {
    if (isPresent(this.args.flash) && !this.args.flash.exiting) {
      this.args.flash.allowExit();
    }
  }

  _destroyFlashMessage() {
    if (this.args.flash) {
      this.args.flash.destroyMessage();
    }
  }

  @action
  onClick() {
    const destroyOnClick = this.args.flash.destroyOnClick ?? true;

    if (destroyOnClick) {
      this._destroyFlashMessage();
    }
  }

  @action
  onClose() {
    this._destroyFlashMessage();
  }

  @action
  onDidInsert(element: HTMLElement) {
    this.pendingSet = next(this, () => {
      this.active = true;
    });
    this._mouseEnterHandler = this._mouseEnter;
    this._mouseLeaveHandler = this._mouseLeave;
    element.addEventListener('mouseenter', this._mouseEnterHandler);
    element.addEventListener('mouseleave', this._mouseLeaveHandler);
  }

  @action
  onWillDestroy(element: HTMLElement) {
    element.removeEventListener('mouseenter', this._mouseEnterHandler);
    element.removeEventListener('mouseleave', this._mouseLeaveHandler);
    cancel(this.pendingSet);
    this._destroyFlashMessage();
  }
}
