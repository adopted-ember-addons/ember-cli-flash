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


    return FlashMessage.create(merge(options, {
      flashService : service,
      message      : message,
      type         : type         || get(this, 'defaultType'),
      timeout      : timeout      || get(this, 'defaultTimeout'),
      priority     : priority     || get(this, 'defaultPriority'),
      sticky       : sticky       || get(this, 'defaultSticky'),
      showProgress : showProgress || get(this, 'defaultShowProgress')
    }));
  },

  _setDefaults: on('init', function() {
    const defaults = getWithDefault(this, 'flashMessageDefaults', {});

   objectKeys(defaults).map((key) => {
      const classifiedKey = key.classify();
      const defaultKey    = `default${classifiedKey}`;

      return set(this, defaultKey, defaults[key]);
    });

    const defaultTypes = getWithDefault(this, 'defaultTypes', []);
    this._registerTypes(defaultTypes);
  }),

  _registerType(type) {
    Ember.assert('The flash type cannot be undefined', type);

    this[type] = ((message, options={}) => {
      return this._addToQueue(merge(options, {
        message      : message,
        type         : type,
        timeout      : options.timeout,
        priority     : options.priority,
        sticky       : options.sticky,
        showProgress : options.showProgress
      }));
    });
  },

  _registerTypes(types=[]) {
    types.forEach((type) => {
      this._registerType(type);
    });
  }
});
