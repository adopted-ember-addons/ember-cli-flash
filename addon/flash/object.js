import Ember from 'ember';

var computed       = Ember.computed;
var get            = Ember.get;
var set            = Ember.set;
var getWithDefault = Ember.getWithDefault;
var run            = Ember.run;

export default Ember.Object.extend({
  isSuccess      : computed.equal('type', 'success'),
  isInfo         : computed.equal('type', 'info'),
  isWarning      : computed.equal('type', 'warning'),
  isDanger       : computed.equal('type', 'danger'),

  defaultTimeout : computed.alias('flashService.defaultTimeout'),
  queue          : computed.alias('flashService.queue'),
  timer          : null,

  destroyMessage: function() {
    this._destroyMessage();
  },

  willDestroy: function() {
    this._super();
    var timer = get(this, 'timer');

    if (timer) {
      run.cancel(timer);
      set(this, 'timer', null);
    }
  },

  // private
  _destroyLater: function() {
    var defaultTimeout = get(this, 'defaultTimeout');
    var timeout        = getWithDefault(this, 'timeout', defaultTimeout);
    var destroyTimer   = run.later(this, '_destroyMessage', timeout);

    set(this, 'timer', destroyTimer);
  }.on('init'),

  _destroyMessage: function() {
    var queue = get(this, 'queue');

    if (queue) {
      queue.removeObject(this);
    }

    this.destroy();
  }
});
