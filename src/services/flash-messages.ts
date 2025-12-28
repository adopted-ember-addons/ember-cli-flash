import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { assert, warn } from '@ember/debug';
import {
  registerDestructor,
  associateDestroyableChild,
} from '@ember/destroyable';

import FlashMessage from '../flash/object.ts';

import type { FlashObjectOptions, Message } from '../flash/object.ts';
import type Owner from '@ember/owner';

type FlashMessageDefaults = {
  timeout: number;
  extendedTimeout: number;
  priority: number;
  sticky: boolean;
  showProgress: boolean;
  type: string;
  types: string[];
  preventDuplicates: boolean;
  destroyOnClick: boolean;
};

type FlashMessageOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> = Partial<FlashMessageDefaults> & {
  message?: Message;
  onDestroy?: () => void;
  onDidDestroyMessage?: () => void;
  onDidExitMessage?: () => void;
  testHelperDisableTimeout?: boolean;
} & T;

type FlashMessageInstance<
  T extends Record<string, unknown> = Record<string, unknown>,
> = FlashMessage<T> &
  T & {
    _guid: string;
    priority: number;
    message: Message;
    type: string;
    preventDuplicates: boolean;
  };

type FlashTypeFunction<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (
  message: Message,
  options?: FlashMessageOptions<T>,
) => FlashMessagesService<T>;

const DEFAULT_FLASH_MESSAGE_OPTIONS: FlashMessageDefaults = {
  timeout: 3000,
  extendedTimeout: 0,
  priority: 100,
  sticky: false,
  showProgress: false,
  type: 'info',
  types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
  preventDuplicates: false,
  destroyOnClick: true,
};

export default class FlashMessagesService<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends Service {
  @tracked queue: FlashMessageInstance<T>[] = [];

  // Set for O(1) duplicate checking
  #guidSet = new Set<string>();

  // Default message type methods (registered dynamically)
  declare success: FlashTypeFunction<T>;
  declare info: FlashTypeFunction<T>;
  declare warning: FlashTypeFunction<T>;
  declare danger: FlashTypeFunction<T>;
  declare alert: FlashTypeFunction<T>;
  declare secondary: FlashTypeFunction<T>;

  // Index signature for dynamically registered types
  [key: string]: unknown;

  get arrangedQueue() {
    return this.queue.slice().sort((a, b) => b.priority - a.priority);
  }

  get isEmpty() {
    return this.queue.length === 0;
  }

  // Backward-compatible getters for default properties (used by tests)
  get defaultTimeout() {
    return this.flashMessageDefaults.timeout;
  }

  get defaultExtendedTimeout() {
    return this.flashMessageDefaults.extendedTimeout;
  }

  get defaultPriority() {
    return this.flashMessageDefaults.priority;
  }

  get defaultSticky() {
    return this.flashMessageDefaults.sticky;
  }

  get defaultShowProgress() {
    return this.flashMessageDefaults.showProgress;
  }

  get defaultType() {
    return this.flashMessageDefaults.type;
  }

  get defaultTypes() {
    return this.flashMessageDefaults.types;
  }

  get defaultPreventDuplicates() {
    return (
      this.#overridePreventDuplicates ??
      this.flashMessageDefaults.preventDuplicates
    );
  }

  set defaultPreventDuplicates(value: boolean) {
    // Allow tests to override default preventDuplicates
    this.#overridePreventDuplicates = value;
  }

  // Override storage for tests
  #overridePreventDuplicates?: boolean;

  /**
   * For backward compatibility - returns array of message guids
   */
  get _guids() {
    return [...this.#guidSet];
  }

  constructor(owner: Owner) {
    super(owner);

    // Register default types
    this.registerTypes(this.flashMessageDefaults.types);

    registerDestructor(this, () => {
      this.clearMessages();
    });
  }

  /** Add a flash message to the queue. Returns the service for chaining. */
  add(options: FlashMessageOptions<T> = {} as FlashMessageOptions<T>): this {
    const flashInstance = this.#createFlashMessage(options);
    this.#enqueue(flashInstance);
    return this;
  }

  /** Clear all flash messages from the queue. */
  clearMessages(): this | void {
    if (!this.queue) {
      return;
    }

    this.queue.forEach((flash) => flash.destroyMessage());
    this.queue = [];
    this.#guidSet.clear();

    return this;
  }

  /** Register custom flash message types (e.g., 'custom' creates service.custom()). */
  registerTypes(types: string[] = []): this {
    types.forEach((type) => this.#registerType(type));
    return this;
  }

  /** Get the first flash message in the queue. */
  peekFirst() {
    return this.queue[0];
  }

  /** Get the last flash message in the queue. */
  peekLast() {
    return this.queue[this.queue.length - 1];
  }

  /** Get the last flash message (throws if queue is empty). */
  getFlashObject() {
    const errorText = 'A flash message must be added before it can be returned';
    assert(errorText, this.queue.length);
    return this.peekLast() as FlashMessageInstance<T>;
  }

  /**
   * Find a flash message by a custom field (e.g., 'id').
   */
  findBy<K extends keyof FlashMessageInstance<T>>(
    key: K,
    value: FlashMessageInstance<T>[K],
  ): FlashMessageInstance<T> | undefined {
    return this.queue.find((flash) => flash[key] === value);
  }

  /**
   * Remove a flash message by a custom field (e.g., 'id').
   */
  removeBy<K extends keyof FlashMessageInstance<T>>(
    key: K,
    value: FlashMessageInstance<T>[K],
  ): boolean {
    const message = this.findBy(key, value);
    if (message) {
      message.destroyMessage();
      return true;
    }
    return false;
  }

  /**
   * Override this getter to customize defaults:
   *
   * ```typescript
   * export default class MyFlashMessages extends FlashMessagesService {
   *   get flashMessageDefaults() {
   *     return { ...super.flashMessageDefaults, timeout: 5000 };
   *   }
   * }
   * ```
   */
  get flashMessageDefaults() {
    return DEFAULT_FLASH_MESSAGE_OPTIONS;
  }

  #createFlashMessage(
    options: FlashMessageOptions<T>,
  ): FlashMessageInstance<T> {
    const defaults = this.flashMessageDefaults;
    const preventDuplicates =
      options.preventDuplicates ??
      this.#overridePreventDuplicates ??
      defaults.preventDuplicates;

    assert(
      'The flash message cannot be empty when preventDuplicates is enabled.',
      !preventDuplicates || options.message,
    );

    // Merge defaults with options using spread (simple and clean)
    const flashOptions: FlashObjectOptions<T> = {
      timeout: defaults.timeout,
      extendedTimeout: defaults.extendedTimeout,
      priority: defaults.priority,
      sticky: defaults.sticky,
      showProgress: defaults.showProgress,
      type: defaults.type,
      destroyOnClick: defaults.destroyOnClick,
      preventDuplicates, // Use calculated value, not defaults
      ...options,
      flashService: this,
    } as FlashObjectOptions<T>;

    const message = new FlashMessage<T>(flashOptions);
    associateDestroyableChild(this, message);
    return message as FlashMessageInstance<T>;
  }

  #registerType(type: string) {
    assert('The flash type cannot be undefined', type);

    (this as Record<string, FlashTypeFunction<T>>)[type] = (
      message,
      options = {} as FlashMessageOptions<T>,
    ) => this.add({ ...options, message, type });
  }

  #enqueue(flashInstance: FlashMessageInstance<T>) {
    const preventDuplicates =
      flashInstance.preventDuplicates ??
      this.#overridePreventDuplicates ??
      this.flashMessageDefaults.preventDuplicates;

    const guid = flashInstance._guid;

    if (preventDuplicates && this.#guidSet.has(guid)) {
      warn(
        'Attempting to add a duplicate message to the Flash Messages Service',
        false,
        { id: 'ember-cli-flash.duplicate-message' },
      );
      return;
    }

    // Always track guid for _guids getter
    this.#guidSet.add(guid);
    this.queue = [...this.queue, flashInstance];
  }

  /**
   * Called by FlashObject when it's destroyed to remove from guid set
   */
  removeFromGuidSet(guid: string) {
    this.#guidSet.delete(guid);
  }
}
