import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const {
  computed,
  getWithDefault,
  merge,
  get  : get,
  set  : set,
  A    : emberArray,
  keys : objectKeys,
  on
} = Ember;

const { classify }     = Ember.String;
const { map, forEach } = Ember.EnumerableUtils;

export default Ember.Service.extend({
  isEmpty: computed.equal('queue.length', 0),

  arrangedQueue: computed.sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }).readOnly(),

  add(options={}) {
    return this._addToQueue(options);
  },

  clearMessages() {
    const flashes = get(this, 'queue');
    flashes.clear();

    return flashes;
  },

  // private
  _addToQueue(options={}) {
    const flashes = get(this, 'queue');
    const flash   = this._newFlashMessage(options);

    flashes.pushObject(flash);
    return flash;
  },

  _newFlashMessage(options={}) {
    Ember.assert('The flash message cannot be empty.', options.message);

    const flashService = this;
    const {
      message,
      timeout,
      type,
      priority,
      sticky,
      showProgress
    } = options;

    return FlashMessage.create(merge(options, {
      message,
      flashService,
      type         : type         || get(this, 'defaultType'),
      timeout      : timeout      || get(this, 'defaultTimeout'),
      priority     : priority     || get(this, 'defaultPriority'),
      sticky       : sticky       || get(this, 'defaultSticky'),
      showProgress : showProgress || get(this, 'defaultShowProgress')
    }));
  },

  _setInitialState: on('init', function() {
    this._setDefaults();
    this._resetQueue();
  }),

  _setDefaults() {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});

    map(objectKeys(defaults), (key) => {
      const classifiedKey = classify(key);
      const defaultKey    = `default${classifiedKey}`;

      return set(this, defaultKey, defaults[key]);
    });

    const defaultTypes = getWithDefault(this, 'defaultTypes', []);
    this._registerTypes(defaultTypes);
  },

  _resetQueue() {
    set(this, 'queue', emberArray([]));
  },

  _registerType(type) {
    Ember.assert('The flash type cannot be undefined', type);

    this[type] = ((message, options={}) => {
      const { timeout, priority, sticky, showProgress } = options;

      return this._addToQueue(merge(options, {
        message,
        type,
        timeout,
        priority,
        sticky,
        showProgress
      }));
    });
  },

  _registerTypes(types=[]) {
    forEach(types, (type) => {
      this._registerType(type);
    });
  },
});
