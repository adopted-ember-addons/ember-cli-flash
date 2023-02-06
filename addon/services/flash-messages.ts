import Service from '@ember/service';
import { isNone, typeOf } from '@ember/utils';
import { assert, warn } from '@ember/debug';
import { setProperties } from '@ember/object';
import { classify } from '@ember/string';
import { A as emberArray } from '@ember/array';
import objectWithout from 'ember-cli-flash/utils/object-without';
import { getOwner } from '@ember/application';
import flashMessageOptions from 'ember-cli-flash/utils/flash-message-options';
import FlashObject from 'ember-cli-flash/flash/object';
import { TrackedArray } from 'tracked-built-ins';
import { cached } from '@glimmer/tracking';

export interface MessageOptions {
  type: string;
  priority: number;
  timeout: number;
  sticky: boolean;
  showProgress: boolean;
  extendedTimeout: number;
  preventDuplicates: boolean;
  destroyOnClick: boolean;
  onDestroy: () => void;
  [key: string]: unknown;
}

export interface CustomMessageInfo extends Partial<MessageOptions> {
  message: string;
}

export interface FlashFunction {
  (message: string, options?: Partial<MessageOptions>): FlashMessagesService;
}

export default class FlashMessagesService extends Service {
  queue: TrackedArray<FlashObject> = new TrackedArray([]);
  [key: string]: unknown;

  get isEmpty() {
    return this.queue.length === 0;
  }

  @cached
  get _guids() {
    return this.queue.map((value) => value._guid);
  }

  @cached
  get arrangedQueue(): TrackedArray<FlashObject> {
    const sorted = this.queue.slice();
    return new TrackedArray<FlashObject>(
      sorted.sort((a: FlashObject, b: FlashObject) => {
        if ((a.priority ?? 0) < (b.priority ?? 0)) {
          return 1;
        } else if (a.priority ?? 0 > (b.priority ?? 0)) {
          return -1;
        }
        return 0;
      })
    );
  }

  declare defaultPreventDuplicates: boolean;
  defaultTypes = ['success', 'warning', 'info', 'danger', 'alert', 'secondary'];

  declare success: FlashFunction;
  declare warning: FlashFunction;
  declare info: FlashFunction;
  declare danger: FlashFunction;
  declare alert: FlashFunction;
  declare secondary: FlashFunction;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
    this._setDefaults();
  }

  willDestroy() {
    // eslint-disable-next-line prefer-rest-params
    (super.willDestroy as any)(...arguments);
    this.clearMessages();
  }

  add(options: Partial<CustomMessageInfo> = {}): FlashMessagesService {
    this._enqueue(this._newFlashMessage(options));

    return this;
  }

  clearMessages(): FlashMessagesService | undefined {
    if (isNone(this.queue)) {
      return;
    }

    this.queue.forEach((flash) => flash.destroyMessage());
    this.queue.length = 0;

    return this;
  }

  registerTypes(types: string[] = emberArray()): FlashMessagesService {
    types.forEach((type) => this._registerType(type));

    return this;
  }

  peekFirst(): FlashObject | undefined {
    return this.queue.length ? this.queue[0] : undefined;
  }

  peekLast(): FlashObject | undefined {
    return this.queue.length ? this.queue[this.queue.length - 1] : undefined;
  }

  removeFromQueue(obj: FlashObject) {
    const index = this.queue.indexOf(obj);
    if (index > -1) {
      // only splice array when item is found
      this.queue.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  getFlashObject(): FlashObject | undefined {
    const errorText = 'A flash message must be added before it can be returned';
    assert(errorText, this.queue.length);

    return this.peekLast();
  }

  _newFlashMessage(options: Partial<CustomMessageInfo> = {}) {
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      this.defaultPreventDuplicates ? options.message : true
    );
    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      options.preventDuplicates ? options.message : true
    );

    const allDefaults = this.flashMessageDefaults ?? {};
    const defaults = objectWithout(allDefaults, ['types', 'preventDuplicates']);

    const flashMessageOptions = Object.assign({}, defaults, { flashService: this });

    for (const key in options) {
      const value = options[key];
      flashMessageOptions[key] = this._getOptionOrDefault(key, value);
    }

    return FlashObject.create(flashMessageOptions);
  }

  _getOptionOrDefault(key: string, value: unknown) {
    const defaults = this.flashMessageDefaults ?? {};
    const defaultOption = defaults[key];

    if (typeOf(value) === 'undefined') {
      return defaultOption;
    }

    return value;
  }

  @cached
  get flashMessageDefaults(): Record<string, unknown> {
    // @ts-ignore todo: remove after ember's Owner has proper types
    const config = getOwner(this).resolveRegistration('config:environment');
    const overrides = config.flashMessageDefaults ?? {};
    return flashMessageOptions(overrides);
  }

  _setDefaults() {
    const defaults = this.flashMessageDefaults ?? {};

    for (const key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      this[defaultKey] = defaults[key];
    }

    this.registerTypes(this.defaultTypes ?? []);
  }

  _registerType(type: string): void {
    assert('The flash type cannot be undefined', type);

    this[type] = (message: string, options: Partial<CustomMessageInfo> = {}) => {
      const flashMessageOptions = Object.assign({}, options);
      setProperties(flashMessageOptions, { message, type });

      return this.add(flashMessageOptions);
    };
  }

  _hasDuplicate(guid: string) {
    return this._guids.includes(guid);
  }

  _enqueue(flashInstance: FlashObject) {
    const instancePreventDuplicates = flashInstance.preventDuplicates;
    const preventDuplicates =
      typeof instancePreventDuplicates === 'boolean'
        ? // always prefer instance option over global option
          instancePreventDuplicates
        : this.defaultPreventDuplicates;

    if (preventDuplicates) {
      const guid = flashInstance._guid;

      if (this._hasDuplicate(guid)) {
        warn('Attempting to add a duplicate message to the Flash Messages Service', false, {
          id: 'ember-cli-flash.duplicate-message',
        });
        return;
      }
    }

    return this.queue.push(flashInstance);
  }
}
