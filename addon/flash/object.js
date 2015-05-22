import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;

const {
  computed,
  getWithDefault,
  run,
  on,
  setProperties,
  Evented
} = Ember;

export default Ember.Object.extend(Evented, {
  isSuccessType: computed.equal('type', 'success').readOnly(),
  isInfoType: computed.equal('type', 'info').readOnly(),
  isWarningType: computed.equal('type', 'warning').readOnly(),
  isDangerType: computed.equal('type', 'danger').readOnly(),
  isErrorType: computed.equal('type', 'error').readOnly(),

  defaultTimeout: computed.readOnly('flashService.defaultTimeout'),
  defaultExtendedTimeout: computed.readOnly('flashService.defaultExtendedTimeout'),
  queue: computed.readOnly('flashService.queue'),
  timer: null,
  exitingTimer: null,
  exiting: false,

  destroyMessage() {
    const queue = get(this, 'queue');
    const flashMessage = this;

    if (queue) {
      queue.removeObject(flashMessage);
    }

    flashMessage.destroy();

    const {
      isDestroying,
      isDestroyed
    } = flashMessage.getProperties('isDestroying', 'isDestroyed');

    this.trigger('destroyMessage',  isDestroyed || isDestroying);
  },

  willDestroy() {
    this._super();
    const timer = get(this, 'timer');

    if (timer) {
      run.cancel(timer);
      set(this, 'timer', null);
    }
  },

  setExiting() {
    const exitingTimer = get(this, 'exitingTimer');
    const isDestroying = get(this, 'isDestroying');
    const isDestroyed = get(this, 'isDestroyed');

    if (!isDestroyed && !isDestroying) {
      setProperties(this, {
        exiting: true,
        exitingTimer: null
      });
    }
    if (exitingTimer) {
      run.cancel(exitingTimer);
    }
  },

  // private
  _destroyLater: on('init', function() {
    if (get(this, 'sticky')) {
      return;
    }

    const defaultExtendedTimeout = get(this, 'defaultExtendedTimeout');
    const extendedTimeout = getWithDefault(this, 'extendedTimeout', defaultExtendedTimeout);

    const defaultTimeout = get(this, 'defaultTimeout');
    const timeout = getWithDefault(this, 'timeout', defaultTimeout);

    const destroyTimer = run.later(this, 'destroyMessage', timeout + extendedTimeout);
    const exitingTimer = run.later(this, 'setExiting', timeout);

    set(this, 'timer', destroyTimer);
    set(this, 'exitingTimer', exitingTimer);
  })
});
