import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { next, cancel } from '@ember/runloop';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i } from 'decorator-transforms/runtime-esm';

class FlashMessage extends Component {
  static {
    g(this.prototype, "active", [tracked], function () {
      return false;
    });
  }
  #active = (i(this, "active"), void 0);
  static {
    g(this.prototype, "pendingSet", [tracked]);
  }
  #pendingSet = (i(this, "pendingSet"), void 0);
  static {
    g(this.prototype, "_mouseEnterHandler", [tracked]);
  }
  #_mouseEnterHandler = (i(this, "_mouseEnterHandler"), void 0);
  static {
    g(this.prototype, "_mouseLeaveHandler", [tracked]);
  }
  #_mouseLeaveHandler = (i(this, "_mouseLeaveHandler"), void 0);
  get messageStyle() {
    return this.args.messageStyle ?? 'bootstrap';
  }
  // Expose flash with custom properties typed (for yielding to blocks)
  get flash() {
    return this.args.flash;
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
    const type = this.args.flash.type || '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  get classNames() {
    const classes = ['flash-message', this.alertType];
    if (this.exiting) classes.push(this.exitingClass);
    if (this.active) classes.push('active');
    return classes.join(' ');
  }
  get progressDuration() {
    if (!this.args.flash?.showProgress) {
      return undefined;
    }
    const duration = this.args.flash?.timeout || 0;
    return htmlSafe(`transition-duration: ${duration}ms`);
  }
  #mouseEnter = () => {
    if (this.args.flash) {
      this.args.flash.preventExit();
    }
  };
  #mouseLeave = () => {
    if (this.args.flash && !this.args.flash.exiting) {
      this.args.flash.allowExit();
    }
  };
  #destroyFlashMessage() {
    if (this.args.flash) {
      this.args.flash.destroyMessage();
    }
  }
  onClick = () => {
    const destroyOnClick = this.args.flash?.destroyOnClick ?? true;
    if (destroyOnClick) {
      this.#destroyFlashMessage();
    }
  };
  onClose = () => {
    this.#destroyFlashMessage();
  };
  bindEvents = modifier(element => {
    // eslint-disable-next-line ember/no-runloop
    const pendingSet = next(this, () => {
      this.active = true;
    });
    this.pendingSet = pendingSet;
    this._mouseEnterHandler = this.#mouseEnter;
    this._mouseLeaveHandler = this.#mouseLeave;
    element.addEventListener('mouseenter', this._mouseEnterHandler);
    element.addEventListener('mouseleave', this._mouseLeaveHandler);
    return () => {
      element.removeEventListener('mouseenter', this._mouseEnterHandler);
      element.removeEventListener('mouseleave', this._mouseLeaveHandler);
      // eslint-disable-next-line ember/no-runloop
      cancel(this.pendingSet);
      this.#destroyFlashMessage();
    };
  });
  static {
    setComponentTemplate(precompileTemplate("<div class={{this.classNames}} role=\"alert\" ...attributes {{!-- template-lint-disable no-invalid-interactive --}} {{on \"click\" this.onClick}} {{this.bindEvents}}>\n  {{#if (has-block)}}\n    {{yield this this.flash this.onClose}}\n  {{else}}\n    {{@flash.message}}\n    {{#if this.showProgressBar}}\n      <div class=\"alert-progress\">\n        <div class=\"alert-progress-bar\" style={{this.progressDuration}}></div>\n      </div>\n    {{/if}}\n  {{/if}}\n</div>", {
      strictMode: true,
      scope: () => ({
        on
      })
    }), this);
  }
}

export { FlashMessage as default };
//# sourceMappingURL=flash-message.js.map
