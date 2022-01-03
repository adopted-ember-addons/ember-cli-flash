import Component from '@ember/component';
import { classify } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { next, cancel } from '@ember/runloop';
import { action, computed, set } from '@ember/object';
import { and, readOnly, not } from '@ember/object/computed';
import layout from '../templates/components/flash-message';

export default class FlashMessage extends Component {
  tagName = '';
  layout = layout;
  active = false;
  messageStyle = 'bootstrap';

  @readOnly('flash.showProgress')
  showProgress;

  @not('exiting')
  notExiting;

  @and('showProgress', 'notExiting')
  showProgressBar;

  @readOnly('flash.exiting')
  exiting;

  @computed('messageStyle')
  get _defaultMessageStylePrefix() {
    const isFoundation = this.messageStyle === 'foundation';
    return isFoundation ? 'alert-box ' : 'alert alert-';
  }

  @computed('flash.type', 'messageStylePrefix', '_defaultMessageStylePrefix')
  get alertType() {
    const flashType = this.flash.type || '';
    const prefix = this.messageStylePrefix || this._defaultMessageStylePrefix;
    return `${prefix}${flashType}`;
  }

  @computed('flash.type')
  get flashType() {
    return classify(this.flash.type || '');
  }

  @computed('flash.{showProgress,timeout}')
  get progressDuration() {
    if (!this.flash?.showProgress) {
      return false;
    }
    const duration = this.flash?.timeout || 0;
    return htmlSafe(`transition-duration: ${duration}ms`);
  }

  _mouseEnter() {
    if (isPresent(this.flash)) {
      this.flash.preventExit();
    }
  }

  _mouseLeave() {
    if (isPresent(this.flash) && !this.flash.exiting) {
      this.flash.allowExit();
    }
  }

  _destroyFlashMessage() {
    if (this.flash) {
      this.flash.destroyMessage();
    }
  }

  @action
  onClick() {
    const destroyOnClick = this.flash?.destroyOnClick ?? true;

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
      set(this, 'active', true);
    });
    set(this, 'pendingSet', pendingSet);
    set(this, '_mouseEnterHandler', this._mouseEnter);
    set(this, '_mouseLeaveHandler', this._mouseLeave);
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
