import Ember from 'ember';

const {
  computed,
  get,
  set,
  getWithDefault,
  run,
  on
} = Ember;

export default Ember.Object.extend({
  isSuccessType  : computed.equal('type', 'success'),
  isInfoType     : computed.equal('type', 'info'),
  isWarningType  : computed.equal('type', 'warning'),
  isDangerType   : computed.equal('type', 'danger'),
  isErrorType    : computed.equal('type', 'error'),

  defaultTimeout : computed.alias('flashService.defaultTimeout'),
  queue          : computed.alias('flashService.queue'),
  timer          : null,

  destroyMessage() {
    this._destroyMessage();
  },

  willDestroy() {
    this._super();
    const timer = get(this, 'timer');

    if (timer) {
      run.cancel(timer);
      set(this, 'timer', null);
    }
  },

  // private
  _destroyLater: on('init', function() {
    const defaultTimeout = get(this, 'defaultTimeout');
    const timeout        = getWithDefault(this, 'timeout', defaultTimeout);
    const destroyTimer   = run.later(this, '_destroyMessage', timeout);

    set(this, 'timer', destroyTimer);
  }),

  _destroyMessage() {
    const queue        = get(this, 'queue');
    const flashMessage = this;

    if (queue) {
      queue.removeObject(flashMessage);
    }

    flashMessage.destroy();
  }
});
