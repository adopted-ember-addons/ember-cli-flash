import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

var {
  computed,
  get,
  run
} = Ember;

export default Ember.Object.extend({
  queue          : Ember.A([]),
  isEmpty        : computed.equal('queue.length', 0),

  defaultTimeout : 2000,

  success(message, timeout=get(this, 'defaultTimeout')) {
    this._addToQueue(message, 'success', timeout);
  },

  info(message, timeout=get(this, 'defaultTimeout')) {
    this._addToQueue(message, 'info', timeout);
  },

  warning(message, timeout=get(this, 'defaultTimeout')) {
    this._addToQueue(message, 'warning', timeout);
  },

  danger(message, timeout=get(this, 'defaultTimeout')) {
    this._addToQueue(message, 'danger', timeout);
  },

  addMessage(message, type='info', timeout=get(this, 'defaultTimeout')) {
    this._addToQueue(message, type, timeout);
  },

  clearMessages() {
    let flashes = get(this, 'queue');

    run.next(this, () => {
      flashes.clear();
    });
  },

  // private
  _addToQueue(message, type, timeout) {
    let flashes = get(this, 'queue');
    let flash   = this._newFlashMessage(this, message, type, timeout);

    run.next(this, () => {
      flashes.pushObject(flash);
    });
  },

  _newFlashMessage(service, message, type='info', timeout=get(this, 'defaultTimeout')) {
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
