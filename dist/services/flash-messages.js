import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { assert, warn } from '@ember/debug';
import { registerDestructor, associateDestroyableChild } from '@ember/destroyable';
import FlashObject from '../flash/object.js';
import { g, i } from 'decorator-transforms/runtime-esm';

const DEFAULT_FLASH_MESSAGE_OPTIONS = {
  timeout: 3000,
  extendedTimeout: 0,
  priority: 100,
  sticky: false,
  showProgress: false,
  type: 'info',
  types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
  preventDuplicates: false,
  destroyOnClick: true
};
class FlashMessagesService extends Service {
  static {
    g(this.prototype, "queue", [tracked], function () {
      return [];
    });
  }
  #queue = (i(this, "queue"), void 0);
  // Set for O(1) duplicate checking
  #guidSet = new Set();

  // Default message type methods (registered dynamically)

  // Index signature for dynamically registered types

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
    return this.#overridePreventDuplicates ?? this.flashMessageDefaults.preventDuplicates;
  }
  set defaultPreventDuplicates(value) {
    // Allow tests to override default preventDuplicates
    this.#overridePreventDuplicates = value;
  }

  // Override storage for tests
  #overridePreventDuplicates;

  /**
   * For backward compatibility - returns array of message guids
   */
  get _guids() {
    return [...this.#guidSet];
  }
  constructor(owner) {
    super(owner);

    // Register default types
    this.registerTypes(this.flashMessageDefaults.types);
    registerDestructor(this, () => {
      this.clearMessages();
    });
  }

  /** Add a flash message to the queue. Returns the service for chaining. */
  add(options = {}) {
    const flashInstance = this.#createFlashMessage(options);
    this.#enqueue(flashInstance);
    return this;
  }

  /** Clear all flash messages from the queue. */
  clearMessages() {
    if (!this.queue) {
      return;
    }
    this.queue.forEach(flash => flash.destroyMessage());
    this.queue = [];
    this.#guidSet.clear();
    return this;
  }

  /** Register custom flash message types (e.g., 'custom' creates service.custom()). */
  registerTypes(types = []) {
    types.forEach(type => this.#registerType(type));
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
    return this.peekLast();
  }

  /**
   * Find a flash message by a custom field (e.g., 'id').
   */
  findBy(key, value) {
    return this.queue.find(flash => flash[key] === value);
  }

  /**
   * Remove a flash message by a custom field (e.g., 'id').
   */
  removeBy(key, value) {
    const message = this.findBy(key, value);
    if (message) {
      // Remove from queue immediately so the message disappears from the UI
      // without waiting for the extendedTimeout exit-animation delay.
      // destroyMessage() still handles timer cleanup and destroyable teardown.
      this.queue = this.queue.filter(flash => flash !== message);
      this.#guidSet.delete(message._guid);
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
  #createFlashMessage(options) {
    const defaults = this.flashMessageDefaults;
    const preventDuplicates = options.preventDuplicates ?? this.#overridePreventDuplicates ?? defaults.preventDuplicates;
    assert('The flash message cannot be empty when preventDuplicates is enabled.', !preventDuplicates || options.message);

    // Merge defaults with options using spread (simple and clean)
    const flashOptions = {
      timeout: defaults.timeout,
      extendedTimeout: defaults.extendedTimeout,
      priority: defaults.priority,
      sticky: defaults.sticky,
      showProgress: defaults.showProgress,
      type: defaults.type,
      destroyOnClick: defaults.destroyOnClick,
      preventDuplicates,
      // Use calculated value, not defaults
      ...options,
      flashService: this
    };
    const message = new FlashObject(flashOptions);
    associateDestroyableChild(this, message);
    return message;
  }
  #registerType(type) {
    assert('The flash type cannot be undefined', type);
    this[type] = (message, options = {}) => this.add({
      ...options,
      message,
      type
    });
  }
  #enqueue(flashInstance) {
    const preventDuplicates = flashInstance.preventDuplicates ?? this.#overridePreventDuplicates ?? this.flashMessageDefaults.preventDuplicates;
    const guid = flashInstance._guid;
    if (preventDuplicates && this.#guidSet.has(guid)) {
      warn('Attempting to add a duplicate message to the Flash Messages Service', false, {
        id: 'ember-cli-flash.duplicate-message'
      });
      return;
    }

    // Always track guid for _guids getter
    this.#guidSet.add(guid);
    this.queue = [...this.queue, flashInstance];
  }

  /**
   * Called by FlashObject when it's destroyed to remove from guid set
   */
  removeFromGuidSet(guid) {
    this.#guidSet.delete(guid);
  }
}

export { FlashMessagesService as default };
//# sourceMappingURL=flash-messages.js.map
