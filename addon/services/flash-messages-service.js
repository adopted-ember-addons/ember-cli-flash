import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';
import objectWithout from '../utils/object-without';

const get = Ember.get;
const set = Ember.set;
const {
  Service,
  assert,
  computed,
  copy,
  getWithDefault,
  isNone,
  merge,
  on,
  setProperties,
  typeOf,
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
    const flashes = get(this, 'queue');
    const flash = this._newFlashMessage(options);

    flashes.pushObject(flash);
    return flash;
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
      'type',
      'types',
      'injectionFactories'
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
  }
});
