import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';
import objectWithout from '../utils/object-without';
import computed from 'ember-new-computed';

const {
  Service,
  assert,
  copy,
  getWithDefault,
  isNone,
  merge,
  on,
  setProperties,
  typeOf,
  warn,
  get,
  set,
  A: emberArray
} = Ember;

const { classify } = Ember.String;

export default Service.extend({
  isEmpty: computed.equal('queue.length', 0).readOnly(),

  arrangedQueue: computed.sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }).readOnly(),

  add(options = {}) {
    const flash = this._newFlashMessage(options);

    return this._pushToQueue(flash);
  },

  clearMessages() {
    const flashes = get(this, 'queue');

    if (isNone(flashes)) {
      set(this, 'queue', emberArray([]));
    } else {
      flashes.clear();
    }

    return flashes;
  },

  registerTypes(types = []) {
    types.forEach((type) => this._registerType(type));
  },

  _newFlashMessage(options = {}) {
    assert('The flash message cannot be empty.', options.message);

    const flashService = this;
    const allDefaults = getWithDefault(this, 'flashMessageDefaults', {});
    const defaults = objectWithout(allDefaults, [
      'types',
      'injectionFactories',
      'preventDuplicates'
    ]);

    const flashMessageOptions = merge(copy(defaults), { flashService });

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

  _setInitialState: on('init', function() {
    this._setDefaults();
    this.clearMessages();
  }),

  _setDefaults() {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});

    for (let key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      set(this, defaultKey, defaults[key]);
    }

    this.registerTypes(getWithDefault(this, 'defaultTypes', []));
  },

  _registerType(type) {
    assert('The flash type cannot be undefined', type);

    this[type] = ((message, options = {}) => {
      const flashMessageOptions = copy(options);
      setProperties(flashMessageOptions, { message, type });

      return this.add(flashMessageOptions);
    });
  },

  _guids: computed.mapBy('queue', '_guid').readOnly(),

  _hasDuplicate(guid) {
    const guids = get(this, '_guids');

    return guids.contains(guid);
  },

  _pushToQueue(flashInstance) {
    const preventDuplicates = get(this, 'defaultPreventDuplicates');
    const flashes = get(this, 'queue');
    const guid = get(flashInstance, '_guid');

    if (preventDuplicates && this._hasDuplicate(guid)) {
      warn('Attempting to add a duplicate message to the Flash Messages Service');
      return;
    }

    flashes.pushObject(flashInstance);

    return flashInstance;
  }
});
