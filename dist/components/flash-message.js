import { _ as _applyDecoratedDescriptor, a as _initializerDefineProperty, b as _defineProperty } from '../_rollupPluginBabelHelpers-e795903d.js';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { classify } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { next, cancel } from '@ember/runloop';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div\n  class=\"flash-message {{this.alertType}} {{if this.exiting this.exitingClass}} {{if this.active \"active\"}}\"\n  role=\"alert\"\n  ...attributes\n  {{on \"click\" this.onClick}}\n  {{this.bindEvents}}\n  {{! template-lint-disable no-invalid-interactive }}\n>\n  {{#if (has-block)}}\n    {{yield this @flash this.onClose}}\n  {{else}}\n    {{@flash.message}}\n    {{#if this.showProgressBar}}\n      <div class=\"alert-progress\">\n        <div class=\"alert-progressBar\" style={{this.progressDuration}}></div>\n      </div>\n    {{/if}}\n  {{/if}}\n</div>");

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;
let FlashMessage = (_class = class FlashMessage extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "active", _descriptor, this);
    _initializerDefineProperty(this, "pendingSet", _descriptor2, this);
    _initializerDefineProperty(this, "_mouseEnterHandler", _descriptor3, this);
    _initializerDefineProperty(this, "_mouseLeaveHandler", _descriptor4, this);
    _defineProperty(this, "bindEvents", modifier(element => {
      const pendingSet = next(this, () => {
        this.active = true;
      });
      this.pendingSet = pendingSet;
      this._mouseEnterHandler = this._mouseEnter;
      this._mouseLeaveHandler = this._mouseLeave;
      element.addEventListener('mouseenter', this._mouseEnterHandler);
      element.addEventListener('mouseleave', this._mouseLeaveHandler);
      return () => {
        element.removeEventListener('mouseenter', this._mouseEnterHandler);
        element.removeEventListener('mouseleave', this._mouseLeaveHandler);
        cancel(this.pendingSet);
        this._destroyFlashMessage();
      };
    }));
  }
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
  get exitingClass() {
    return this.args.exitingClass || 'exiting';
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
  _mouseEnter() {
    if (isPresent(this.args.flash)) {
      this.args.flash.preventExit();
    }
  }
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
  onClick() {
    const destroyOnClick = this.args.flash?.destroyOnClick ?? true;
    if (destroyOnClick) {
      this._destroyFlashMessage();
    }
  }
  onClose() {
    this._destroyFlashMessage();
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "active", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "pendingSet", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "_mouseEnterHandler", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "_mouseLeaveHandler", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class.prototype, "_mouseEnter", [action], Object.getOwnPropertyDescriptor(_class.prototype, "_mouseEnter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "_mouseLeave", [action], Object.getOwnPropertyDescriptor(_class.prototype, "_mouseLeave"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onClick"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onClose", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onClose"), _class.prototype)), _class);
setComponentTemplate(TEMPLATE, FlashMessage);

export { FlashMessage as default };
//# sourceMappingURL=flash-message.js.map
