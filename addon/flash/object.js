import Ember from 'ember';

var {
  computed,
  get,
  set,
  getWithDefault,
  run
} = Ember;

export default Ember.Object.extend({
  isSuccess      : computed.equal('type', 'success'),
  isInfo         : computed.equal('type', 'info'),
  isWarning      : computed.equal('type', 'warning'),
  isDanger       : computed.equal('type', 'danger'),

  defaultTimeout : computed.alias('flashService.defaultTimeout'),
  queue          : computed.alias('flashService.queue'),

  destroyLater: function() {
    let defaultTimeout = get(this, 'defaultTimeout');
    let timeout        = getWithDefault(this, 'timeout', defaultTimeout);

    run.later(this, '_destroyMessage', timeout);
  }.on('init'),

  destroyMessage() {
    this._destroyMessage();
  },

  // private
  _destroyMessage() {
    run.next(this, () => {
      set(this, 'isDestroyed', true);
      get(this, 'queue').removeObject(this);
    });
  }
});
