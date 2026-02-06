import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { next, cancel } from '@ember/runloop';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';

import type { Timer } from '@ember/runloop';
import type FlashObject from '../flash/object.ts';

export interface FlashMessageSignature {
  Args: {
    flash: FlashObject;
    messageStyle?: 'bootstrap' | 'foundation';
    messageStylePrefix?: string;
    exitingClass?: string;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [FlashMessage, FlashObject, onClose: () => void];
  };
}

export default class FlashMessage extends Component<FlashMessageSignature> {
  @tracked active = false;
  @tracked pendingSet: Timer | undefined;
  @tracked _mouseEnterHandler: ((event?: Event) => void) | undefined;
  @tracked _mouseLeaveHandler: ((event?: Event) => void) | undefined;

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

  bindEvents = modifier((element: Element) => {
    // eslint-disable-next-line ember/no-runloop
    const pendingSet = next(this, () => {
      this.active = true;
    });

    this.pendingSet = pendingSet;
    this._mouseEnterHandler = this.#mouseEnter;
    this._mouseLeaveHandler = this.#mouseLeave;

    element.addEventListener(
      'mouseenter',
      this._mouseEnterHandler as EventListener,
    );

    element.addEventListener(
      'mouseleave',
      this._mouseLeaveHandler as EventListener,
    );

    return () => {
      element.removeEventListener(
        'mouseenter',
        this._mouseEnterHandler as EventListener,
      );

      element.removeEventListener(
        'mouseleave',
        this._mouseLeaveHandler as EventListener,
      );

      // eslint-disable-next-line ember/no-runloop
      cancel(this.pendingSet);

      this.#destroyFlashMessage();
    };
  });

  <template>
    <div
      class={{this.classNames}}
      role="alert"
      ...attributes
      {{! template-lint-disable no-invalid-interactive }}
      {{on "click" this.onClick}}
      {{this.bindEvents}}
    >
      {{#if (has-block)}}
        {{yield this @flash this.onClose}}
      {{else}}
        {{@flash.message}}
        {{#if this.showProgressBar}}
          <div class="alert-progress">
            <div
              class="alert-progress-bar"
              style={{this.progressDuration}}
            ></div>
          </div>
        {{/if}}
      {{/if}}
    </div>
  </template>
}
