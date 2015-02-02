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

  destroyMessage: function() {
    this._destroyMessage();
  },

  // private
  _destroyLater: function() {
    var defaultTimeout = get(this, 'defaultTimeout');
    var timeout        = getWithDefault(this, 'timeout', defaultTimeout);

    run.later(this, '_destroyMessage', timeout);
  }.on('init'),

  _destroyMessage: function() {
    run.next(this, function() {
      set(this, 'isDestroyed', true);
      get(this, 'queue').removeObject(this);
    });
  }
});
