import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

var computed = Ember.computed;
var get      = Ember.get;

export default Ember.Service.extend({
  queue           : Ember.A([]),
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

  success: function(message, options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : message,
      type     : 'success',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  info: function(message, options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : message,
      type     : 'info',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  warning: function(message, options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : message,
      type     : 'warning',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  danger: function(message, options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : message,
      type     : 'danger',
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  addMessage: function(message, options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : message,
      type     : options.type,
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  add: function(options) {
    options = (typeof options === 'undefined') ? {} : options;

    return this._addToQueue({
      message  : options.message,
      type     : options.type,
      timeout  : options.timeout,
      priority : options.priority
    });
  },

  clearMessages: function() {
    var flashes = get(this, 'queue');
    flashes.clear();

    return flashes;
  },

  // private
  _addToQueue: function(options) {
    var flashes = get(this, 'queue');
    var flash   = this._newFlashMessage(options);

    flashes.pushObject(flash);
    return flash;
  },

  _newFlashMessage: function(options) {
    Ember.assert('Must pass a valid flash message', options.message);

    var timeout  = (options.timeout === undefined) ? get(this, 'defaultTimeout') : options.timeout;
    var type     = (options.type === undefined) ? get(this, 'defaultType') : options.type;
    var priority = (options.priority === undefined) ? get(this, 'defaultPriority') : options.priority;
    var service  = this;

    return FlashMessage.create({
      message      : options.message,
      type         : type,
      timeout      : timeout,
      priority     : priority,
      flashService : service
    });
  }
});
