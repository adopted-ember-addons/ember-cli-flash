import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { typeOf, isNone } from '@ember/utils';
import { warn, assert } from '@ember/debug';
import { classify } from '@ember/string';
import { getOwner } from '@ember/owner';
import {
  associateDestroyableChild,
  registerDestructor,
} from '@ember/destroyable';

import FlashMessage from '../flash/object.ts';
import objectWithout from '../utils/object-without.ts';
import flashMessageOptions from '../utils/flash-message-options.ts';

import type { MessageOptions } from '../flash/object.ts';

import type Owner from '@ember/owner';

export type DefaultMessageTypes = ['success', 'error', 'info', 'warning'];

export default class FlashMessagesService extends Service {
  [key: string]: any;

  @tracked queue: FlashMessage[] | [] = [];

  defaultPreventDuplicates: any;
  defaultTypes: DefaultMessageTypes = ['success', 'error', 'info', 'warning'];

  get arrangedQueue() {
    return this.queue.slice().sort(function (a, b) {
      if (a.priority < b.priority) {
        return 1;
      } else if (a.priority > b.priority) {
        return -1;
      }
      return 0;
    });
  }

  get isEmpty() {
    return this.queue.length === 0;
  }

  get #guids() {
    return this.queue.map((flash) => flash.guid);
  }

  constructor(owner: Owner) {
    super(owner);
    this.#setDefaults();

    registerDestructor(this, this.clearMessages.bind(this));
  }

  add(options: MessageOptions = {}) {
    this.#enqueue(this.#newFlashMessage(options));

    return this;
  }

  clearMessages() {
    if (isNone(this.queue)) {
      return;
    }

    this.queue.forEach((flash) => flash.destroyMessage());
    this.queue = [];

    return this;
  }

  registerTypes(types: DefaultMessageTypes | [] = []) {
    types.forEach((type) => this.#registerType(type));

    return this;
  }

  peekFirst() {
    return this.queue[0];
  }

  peekLast() {
    return this.queue[this.queue.length - 1];
  }

  getFlashObject() {
    const errorText = 'A flash message must be added before it can be returned';
    assert(errorText, this.queue.length);

    return this.peekLast();
  }

  #newFlashMessage(options: MessageOptions = {}) {
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      this.defaultPreventDuplicates ? options.message : true,
    );
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      options.preventDuplicates ? options.message : true,
    );

    const defaults = objectWithout(this.flashMessageDefaults, [
      'types',
      'preventDuplicates',
    ]);

    const flashMessageOptions = Object.assign({}, defaults, {
      flashService: this,
    });

    for (const key in options) {
      const value = options[key as keyof MessageOptions];
      const option = this.#getOptionOrDefault(
        key as keyof MessageOptions,
        value,
      );

      flashMessageOptions[key] = option;
    }

    // @ts-expect-error
    const message = new FlashMessage(flashMessageOptions);
    associateDestroyableChild(this, message);
    return message;
  }

  #getOptionOrDefault(key: keyof MessageOptions, value: any) {
    const defaults = this.flashMessageDefaults;
    const defaultOption = defaults[key];

    if (typeOf(value) === 'undefined') {
      return defaultOption;
    }

    return value;
  }

  get flashMessageDefaults() {
    // @ts-expect-error
    const config = getOwner(this)?.resolveRegistration('config:environment');

    const overrides = config.flashMessageDefaults ?? {};
    return flashMessageOptions(overrides);
  }

  #setDefaults() {
    const defaults = this.flashMessageDefaults;

    for (const key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      this[defaultKey] = (defaults as Record<string, any>)[key];
    }

    this.registerTypes(this.defaultTypes ?? []);
  }

  #registerType(type: string) {
    assert('The flash type cannot be undefined', type);

    this[type] = (message: string, options = {}) => {
      const flashMessageOptions = Object.assign({}, options);
      Object.assign(flashMessageOptions, { message, type });

      return this.add(flashMessageOptions);
    };
  }

  #hasDuplicate(guid: string) {
    return this.#guids.includes(guid);
  }

  #enqueue(flashInstance: FlashMessage) {
    const instancePreventDuplicates = flashInstance.preventDuplicates;
    const preventDuplicates =
      typeof instancePreventDuplicates === 'boolean'
        ? // always prefer instance option over global option
          instancePreventDuplicates
        : this.defaultPreventDuplicates;

    if (preventDuplicates) {
      const guid = flashInstance.guid;

      if (this.#hasDuplicate(guid)) {
        warn(
          'Attempting to add a duplicate message to the Flash Messages Service',
          false,
          {
            id: 'ember-cli-flash.duplicate-message',
          },
        );
        return;
      }
    }

    this.queue = [...this.queue, flashInstance];
    return this.queue;
  }
}
