import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const get = Ember.get;
const set = Ember.set;

const {
  computed,
  getWithDefault,
  merge,
  on,
  A: emberArray
} = Ember;

const { classify } = Ember.String;

export default Ember.Service.extend({
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
    flashes.clear();

    return flashes;
  },

  _newFlashMessage(options = {}) {
    Ember.assert('The flash message cannot be empty.', options.message);

    const flashService = this;
    const {
      message,
      timeout,
      type,
      priority,
      sticky,
      showProgress,
      extendedTimeout,
    } = options;

    return FlashMessage.create(merge(options, {
      message,
      flashService,
      type: type || get(this, 'defaultType'),
      timeout: timeout || get(this, 'defaultTimeout'),
      priority: priority || get(this, 'defaultPriority'),
      sticky: sticky || get(this, 'defaultSticky'),
      showProgress: showProgress || get(this, 'defaultShowProgress'),
      extendedTimeout: extendedTimeout || get(this, 'defaultExtendedTimeout')
    }));
  },

  _setInitialState: on('init', function() {
    this._setDefaults();
    this._resetQueue();
  }),

  _setDefaults() {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});

    for (let key in defaults) {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;

      set(this, defaultKey, defaults[key]);
    }

    this._registerTypes(getWithDefault(this, 'defaultTypes', []));
  },

  _resetQueue() {
    set(this, 'queue', emberArray([]));
  },

  _registerType(type) {
    Ember.assert('The flash type cannot be undefined', type);

    this[type] = ((message, options = {}) => {
      const { timeout, priority, sticky, showProgress, extendedTimeout } = options;

      return this.add(merge(options, {
        message,
        type,
        timeout,
        priority,
        sticky,
        showProgress,
        extendedTimeout
      }));
    });
  },

  _registerTypes(types = []) {
    types.forEach((type) => this._registerType(type));
  }
});
