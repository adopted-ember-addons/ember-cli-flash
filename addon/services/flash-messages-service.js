import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

var computed = Ember.computed;
var get      = Ember.get;

export default Ember.Service.extend({
  queue          : Ember.A([]),
  isEmpty        : computed.equal('queue.length', 0),

  defaultTimeout : 2000,

  success: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue(message, 'success', timeout);
  },

  info: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue(message, 'info', timeout);
  },

  warning: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue(message, 'warning', timeout);
  },

  danger: function(message, timeout) {
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue(message, 'danger', timeout);
  },

  addMessage: function(message, type, timeout) {
    type    = (type === undefined) ? 'info' : type;
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    return this._addToQueue(message, type, timeout);
  },

  clearMessages: function() {
    var flashes = get(this, 'queue');
    flashes.clear();

    return flashes;
  },

  // private
  _addToQueue: function(message, type, timeout) {
    var flashes = get(this, 'queue');
    var flash   = this._newFlashMessage(this, message, type, timeout);

    flashes.pushObject(flash);
    return flash;
  },

  _newFlashMessage: function(service, message, type, timeout) {
    type    = (type === undefined) ? 'info' : type;
    timeout = (timeout === undefined) ? get(this, 'defaultTimeout') : timeout;

    Ember.assert('Must pass a valid flash service', service);
    Ember.assert('Must pass a valid flash message', message);

    return FlashMessage.create({
      type         : type,
      message      : message,
      timeout      : timeout,
      flashService : service
    });
  }
});
