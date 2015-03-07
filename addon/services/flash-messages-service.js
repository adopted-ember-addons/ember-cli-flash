import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

var computed    = Ember.computed;
var get         = Ember.get;
var aliasMethod = Ember.aliasMethod;

export default Ember.Service.extend({
  queue          : Ember.A([]),
  isEmpty        : computed.equal('queue.length', 0),

  defaultTimeout : 2000,

  success: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue({
      message : message,
      type    : 'success',
      timeout : timeout
    });
  },

  info: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue({
      message : message,
      type    : 'info',
      timeout : timeout
    });
  },

  warning: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue({
      message : message,
      type    : 'warning',
      timeout : timeout
    });
  },

  danger: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue({
      message : message,
      type    : 'danger',
      timeout : timeout
    });
  },

  addMessage: function(message, type, timeout) {
    type    = (type === undefined) ? 'info' : type;
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue({
      message : message,
      type    : type,
      timeout : timeout
    });
  },

  add: aliasMethod('addMessage'),

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
    Ember.assert('Must pass a valid type', options.type);
    Ember.assert('Must pass a valid timeout', options.timeout);

    var service = this;

    return FlashMessage.create({
      message      : options.message,
      type         : options.type,
      timeout      : options.timeout,
      flashService : service
    });
  }
});
