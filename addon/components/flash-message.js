import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { classify } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { next, cancel } from '@ember/runloop';
import { action, computed } from '@ember/object';

/**
 * ARGS
 *
 * flash: FlashObject
 * messageStyle?: 'bootstrap' | 'foundation'
 * messageStylePrefix?: string
 */

export default class FlashMessage extends Component {
  @tracked active = false;

  @tracked pendingSet;
  @tracked _mouseEnterHandler;
  @tracked _mouseLeaveHandler;

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

  @computed('messageStyle')
  get _defaultMessageStylePrefix() {
    const isFoundation = this.messageStyle === 'foundation';
    return isFoundation ? 'alert-box ' : 'alert alert-';
  }

  @computed('args.flash.type', 'messageStylePrefix')
  get alertType() {
    const flashType = this.args.flash.type || '';
    const prefix = this.messageStylePrefix;
    return `${prefix}${flashType}`;
  }

  @computed('args.flash.type')
  get flashType() {
    return classify(this.args.flash.type || '');
  }

  @computed('args.flash.{showProgress,timeout}')
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
    const destroyOnClick = this.args.flash?.destroyOnClick ?? true;

    if (destroyOnClick) {
      this._destroyFlashMessage();
    }
  }

  @action
  onClose() {
    this._destroyFlashMessage();
  }

  @action
  onDidInsert(element) {
    const pendingSet = next(this, () => {
      this.active = true;
    });
    this.pendingSet = pendingSet;
    this._mouseEnterHandler = this._mouseEnter;
    this._mouseLeaveHandler = this._mouseLeave;
    element.addEventListener('mouseenter', this._mouseEnterHandler);
    element.addEventListener('mouseleave', this._mouseLeaveHandler);
  }

  @action
  onWillDestroy(element) {
    element.removeEventListener('mouseenter', this._mouseEnterHandler);
    element.removeEventListener('mouseleave', this._mouseLeaveHandler);
    cancel(this.pendingSet);
    this._destroyFlashMessage();
  }
}
