/* eslint-disable ember/no-computed-properties-in-native-classes */
import Service from '@ember/service';
import { typeOf, isNone } from '@ember/utils';
import { warn, assert } from '@ember/debug';
import { set, setProperties, computed } from '@ember/object';
import { classify } from '@ember/string';
import FlashMessage from '../flash/object';
import objectWithout from '../utils/object-without';
import { getOwner } from '@ember/application';
import flashMessageOptions from '../utils/flash-message-options';
import { associateDestroyableChild } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';

export default class FlashMessagesService extends Service {
  @tracked queue = [];

  get arrangedQueue() {
    return this.queue.sort(function (a, b) {
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

  get _guids() {
    return this.queue.map((flash) => flash._guid);
  }

  constructor() {
    super(...arguments);
    this._setDefaults();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.clearMessages();
  }

  add(options = {}) {
    this._enqueue(this._newFlashMessage(options));

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

  registerTypes(types = []) {
    types.forEach((type) => this._registerType(type));

    return this;
  }

  peekFirst() {
    return this.queue.at(0);
  }

  peekLast() {
    return this.queue.at(-1);
  }

  getFlashObject() {
    const errorText = 'A flash message must be added before it can be returned';
    assert(errorText, this.queue.length);

    return this.peekLast();
  }

  _newFlashMessage(options = {}) {
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      this.defaultPreventDuplicates ? options.message : true,
    );
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      options.preventDuplicates ? options.message : true,
    );

    const flashService = this;
    const allDefaults = this.flashMessageDefaults ?? {};
    const defaults = objectWithout(allDefaults, ['types', 'preventDuplicates']);

    const flashMessageOptions = Object.assign({}, defaults, { flashService });

    for (let key in options) {
      const value = options[key];
      const option = this._getOptionOrDefault(key, value);

      set(flashMessageOptions, key, option);
    }

    const message = new FlashMessage(flashMessageOptions);
    associateDestroyableChild(this, message);
    return message;
  }

  _getOptionOrDefault(key, value) {
    const defaults = this.flashMessageDefaults ?? {};
    const defaultOption = defaults[key];

    if (typeOf(value) === 'undefined') {
      return defaultOption;
    }

    return value;
  }

  @computed
  get flashMessageDefaults() {
    const config = getOwner(this).resolveRegistration('config:environment');
    const overrides = config.flashMessageDefaults ?? {};
    return flashMessageOptions(overrides);
  }

  _setDefaults() {
    const defaults = this.flashMessageDefaults ?? {};

    for (let key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      set(this, defaultKey, defaults[key]);
    }

    this.registerTypes(this.defaultTypes ?? []);
  }

  _registerType(type) {
    assert('The flash type cannot be undefined', type);

    this[type] = (message, options = {}) => {
      const flashMessageOptions = Object.assign({}, options);
      setProperties(flashMessageOptions, { message, type });

      return this.add(flashMessageOptions);
    };
  }

  _hasDuplicate(guid) {
    return this._guids.includes(guid);
  }

  _enqueue(flashInstance) {
    const instancePreventDuplicates = flashInstance.preventDuplicates;
    const preventDuplicates =
      typeof instancePreventDuplicates === 'boolean'
        ? // always prefer instance option over global option
          instancePreventDuplicates
        : this.defaultPreventDuplicates;

    if (preventDuplicates) {
      const guid = flashInstance._guid;

      if (this._hasDuplicate(guid)) {
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
