import Service from '@ember/service';
import { typeOf, isNone } from '@ember/utils';
import { warn, assert } from '@ember/debug';
import {
  set,
  get,
  setProperties,
  getWithDefault,
  computed
} from '@ember/object';
import {
  mapBy,
  sort,
  equal
} from '@ember/object/computed';
import { classify } from '@ember/string';
import { assign } from '@ember/polyfills';
import { A as emberArray } from '@ember/array';
import FlashMessage from 'ember-cli-flash/flash/object';
import objectWithout from '../utils/object-without';
import { getOwner } from '@ember/application';
import flashMessageOptions from '../utils/flash-message-options';

export default Service.extend({
  isEmpty: equal('queue.length', 0).readOnly(),
  _guids: mapBy('queue', '_guid').readOnly(),

  arrangedQueue: sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }).readOnly(),

  init() {
    this._super(...arguments);
    this._setDefaults();
    this.queue = emberArray();
  },

  willDestroy() {
    this._super(...arguments);
    this.clearMessages();
  },

  add(options = {}) {
    this._enqueue(this._newFlashMessage(options));

    return this;
  },

  clearMessages() {
    const flashes = get(this, 'queue');

    if (isNone(flashes)) {
      return;
    }

    flashes.forEach(flash => flash.destroyMessage());
    flashes.clear();

    return this;
  },

  registerTypes(types = emberArray()) {
    types.forEach((type) => this._registerType(type));

    return this;
  },

  peekFirst() {
    return get(this, 'queue.firstObject');
  },

  peekLast() {
    return get(this, 'queue.lastObject');
  },

  getFlashObject() {
    const errorText = 'A flash message must be added before it can be returned';
    assert(errorText, get(this, 'queue').length);

    return this.peekLast();
  },

  _newFlashMessage(options = {}) {
    assert('The flash message cannot be empty when preventDuplicates is enabled.',
        get(this, 'defaultPreventDuplicates') ? options.message : true);
    assert('The flash message cannot be empty when preventDuplicates is enabled.',
        get(options, 'preventDuplicates') ? options.message : true);

    const flashService = this;
    const allDefaults = getWithDefault(this, 'flashMessageDefaults', {});
    const defaults = objectWithout(allDefaults, [
      'types',
      'injectionFactories',
      'preventDuplicates'
    ]);

    const flashMessageOptions = assign({}, defaults, { flashService });

    for (let key in options) {
      const value = get(options, key);
      const option = this._getOptionOrDefault(key, value);

      set(flashMessageOptions, key, option);
    }

    return FlashMessage.create(flashMessageOptions);
  },

  _getOptionOrDefault(key, value) {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});
    const defaultOption = get(defaults, key);

    if (typeOf(value) === 'undefined') {
      return defaultOption;
    }

    return value;
  },

  flashMessageDefaults: computed(function() {
    const config  = getOwner(this).resolveRegistration('config:environment');
    const overrides = getWithDefault(config, 'flashMessageDefaults', {});
    return flashMessageOptions(overrides);
  }),

  _setDefaults() {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});

    for (let key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      set(this, defaultKey, defaults[key]);
    }

    this.registerTypes(getWithDefault(this, 'defaultTypes', emberArray()));
  },

  _registerType(type) {
    assert('The flash type cannot be undefined', type);

    this[type] = ((message, options = {}) => {
      const flashMessageOptions = assign({}, options);
      setProperties(flashMessageOptions, { message, type });

      return this.add(flashMessageOptions);
    });
  },

  _hasDuplicate(guid) {
    return get(this, '_guids').includes(guid);
  },

  _enqueue(flashInstance) {
    const instancePreventDuplicates = get(flashInstance, 'preventDuplicates');
    const preventDuplicates = typeof instancePreventDuplicates === 'boolean' ?
      // always prefer instance option over global option
      instancePreventDuplicates :
      get(this, 'defaultPreventDuplicates');

    if (preventDuplicates) {
      const guid = get(flashInstance, '_guid');

      if (this._hasDuplicate(guid)) {
        warn('Attempting to add a duplicate message to the Flash Messages Service', false, {
          id: 'ember-cli-flash.duplicate-message'
        });
        return;
      }
    }

    return get(this, 'queue').pushObject(flashInstance);
  }
});
