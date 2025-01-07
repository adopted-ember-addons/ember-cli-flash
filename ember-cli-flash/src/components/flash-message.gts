/* eslint-disable ember/no-runloop */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { classify } from '@ember/string';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';
import { next, cancel } from '@ember/runloop';
import { modifier } from 'ember-modifier';

import type FlashObject from '../flash/object.ts';
import type { Timer } from '@ember/runloop';

export interface FlashMessageSignature {
  Args: {
    flash: FlashObject;
    messageStyle?: 'bootstrap' | 'foundation';
    messageStylePrefix?: string;
    exitingClass?: string;
  };

  Blocks: {
    default: [FlashMessage, FlashObject, FlashMessage['onClick']];
  };

  Element: HTMLDivElement;
}

export default class FlashMessage extends Component<FlashMessageSignature> {
  @tracked active = false;
  @tracked pendingSet: Timer | undefined;

  #mouseEnterHandler = () => {};
  #mouseLeaveHandler = () => {};

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
    return this.args.messageStylePrefix ?? this.#defaultMessageStylePrefix;
  }

  get #defaultMessageStylePrefix() {
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

  #mouseEnter = () => {
    if (isPresent(this.args.flash)) {
      this.args.flash.preventExit();
    }
  };

  #mouseLeave = () => {
    if (isPresent(this.args.flash) && !this.args.flash.exiting) {
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

  bindEvents = modifier((element) => {
    const pendingSet = next(this, () => {
      this.active = true;
    });

    this.pendingSet = pendingSet;
    this.#mouseEnterHandler = this.#mouseEnter;
    this.#mouseLeaveHandler = this.#mouseLeave;

    element.addEventListener('mouseenter', this.#mouseEnterHandler);
    element.addEventListener('mouseleave', this.#mouseLeaveHandler);

    return () => {
      element.removeEventListener('mouseenter', this.#mouseEnterHandler);
      element.removeEventListener('mouseleave', this.#mouseLeaveHandler);
      cancel(this.pendingSet);
      this.#destroyFlashMessage();
    };
  });

  <template>
    <div
      class="flash-message
        {{this.alertType}}
        {{if this.exiting this.exitingClass}}
        {{if this.active 'active'}}"
      role="alert"
      ...attributes
      {{on "click" this.onClick}}
      {{this.bindEvents}}
      {{! template-lint-disable no-invalid-interactive}}
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
