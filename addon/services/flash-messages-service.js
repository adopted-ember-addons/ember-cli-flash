import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const { computed, get, getWithDefault, A: emberArray, on } = Ember;

export default Ember.Service.extend({
  queue           : emberArray([]),
  isEmpty         : computed.equal('queue.length', 0),
  defaultTimeout  : 2000,
  defaultPriority : 100,
  defaultTypes    : [ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ],
  defaultType     : 'info',

  arrangedQueue: computed.sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }),

  registerType(type) {
    Ember.assert('The flash type cannot be undefined', type);

    this[type] = ((message, options={}) => {
      return this._addToQueue({
        message  : message,
        type     : type,
        timeout  : options.timeout,
        priority : options.priority
      });
    });
  },

  // custom
  addMessage: function(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : options.type,
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  add: function(options={}) {
    return this._addToQueue({
      message  : options.message,
      type     : options.type,
      timeout  : options.timeout,
      priority : options.priority
    });
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

    const timeout  = (options.timeout  === undefined) ? get(this, 'defaultTimeout')  : options.timeout;
    const type     = (options.type     === undefined) ? get(this, 'defaultType')     : options.type;
    const priority = (options.priority === undefined) ? get(this, 'defaultPriority') : options.priority;
    const service  = this;

    return FlashMessage.create({
      message      : options.message,
      type         : type,
      timeout      : timeout,
      priority     : priority,
      flashService : service
    });
  },

  _registerTypes(types=[]) {
    types.forEach(type => this.registerType(type));
  },

  _initTypes: on('init', function() {
    const defaultTypes = getWithDefault(this, 'defaultTypes', []);

    this._registerTypes(defaultTypes);
  })
});
