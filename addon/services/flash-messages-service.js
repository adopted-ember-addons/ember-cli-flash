import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const { computed, get, A: emberArray } = Ember;

export default Ember.Service.extend({
  queue           : emberArray([]),
  isEmpty         : computed.equal('queue.length', 0),
  defaultTimeout  : 2000,
  defaultPriority : 100,
  defaultType     : 'info',

  arrangedQueue: computed.sort('queue', function(a, b) {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    }
    return 0;
  }),

  success(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : 'success',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  info: function(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : 'info',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  warning: function(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : 'warning',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  danger: function(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : 'danger',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  error: function(message, options={}) {
    return this._addToQueue({
      message  : message,
      type     : 'error',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

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
    Ember.assert('Must pass a valid flash message', options.message);

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
  }
});
