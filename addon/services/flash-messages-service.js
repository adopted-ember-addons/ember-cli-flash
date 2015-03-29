import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const {
  computed,
  getWithDefault,
  get: get,
  set: set,
  A: emberArray,
  on
} = Ember;

export default Ember.Service.extend({
  queue   : emberArray([]),
  isEmpty : computed.equal('queue.length', 0),

  arrangedQueue: computed.sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }),

  registerType(type) {
    Ember.deprecate(`[ember-cli-flash] registerType() is a private method and will be deprecated in 1.0.0. Please add your type to the global config instead.`);

    this._registerType(type);
  },

  // custom
  addMessage(message, options={}) {
    Ember.deprecate(`[ember-cli-flash] addMessage() will be deprecated in 1.0.0. Please use add() instead.`);

    options.message = message;
    return this._addToQueue(options);
  },

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

    const service = this;
    const {
      message,
      timeout,
      type,
      priority,
      sticky,
      showProgress
    } = options;

    return FlashMessage.create({
      flashService : service,
      message      : message,
      type         : type         || get(this, 'defaultType'),
      timeout      : timeout      || get(this, 'defaultTimeout'),
      priority     : priority     || get(this, 'defaultPriority'),
      sticky       : sticky       || get(this, 'defaultSticky'),
      showProgress : showProgress || get(this, 'defaultShowProgress')
    });
  },

  _getDefaults() {
    const serviceDefaults = {
      timeout      : 3000,
      priority     : 100,
      sticky       : false,
      showProgress : false,
      type         : 'info',
      types        : [ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ]
    };

    const defaults = Ember.ENV.flashMessageDefaults || {};
    Ember.merge(defaults, serviceDefaults);
    return defaults;
  },

  _setDefaults: on('init', function() {
    const defaults = this._getDefaults();

    Object.keys(defaults).map((key) => {
      const classifiedKey = key.classify();
      const defaultKey    = `default${classifiedKey}`;

      set(this, defaultKey, defaults[key]);
    });

    const defaultTypes = getWithDefault(this, 'defaultTypes', []);
    this._registerTypes(defaultTypes);
  }),

  _registerType(type) {
    Ember.assert('The flash type cannot be undefined', type);

    this[type] = ((message, options={}) => {
      return this._addToQueue({
        message      : message,
        type         : type,
        timeout      : options.timeout,
        priority     : options.priority,
        sticky       : options.sticky,
        showProgress : options.showProgress
      });
    });
  },

  _registerTypes(types=[]) {
    types.forEach((type) => {
      this._registerType(type);
    });
  }
});
