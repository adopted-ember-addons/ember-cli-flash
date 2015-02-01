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
    this._add(message, 'success', timeout);
  },

  info(message, timeout=get(this, 'defaultTimeout')) {
    this._add(message, 'info', timeout);
  },

  warning(message, timeout=get(this, 'defaultTimeout')) {
    this._add(message, 'warning', timeout);
  },

  danger(message, timeout=get(this, 'defaultTimeout')) {
    this._add(message, 'danger', timeout);
  },

  addMessage(message, type='info', timeout=get(this, 'defaultTimeout')) {
    this._add(message, type, timeout);
  },

  clearMessages() {
    let flashes = get(this, 'queue');

    run.next(this, () => {
      flashes.clear();
    });
  },

  // private
  _add(message, type, timeout) {
    let flashes = get(this, 'queue');
    let flash   = this._newFlashMessage(this, message, type, timeout);

    run.next(this, () => {
      flashes.pushObject(flash);
    });
  },

  _newFlashMessage(service, message, type, timeout) {
    Ember.assert('Must pass a valid flash service', service);
    Ember.assert('Must pass a valid flash message', message);

    type    = (typeof type === 'undefined') ? 'info' : type;
    timeout = timeout || Ember.get(this, 'defaultTimeout');

    return FlashMessage.create({
      type         : type,
      message      : message,
      timeout      : timeout,
      flashService : service
    });
  }
});
