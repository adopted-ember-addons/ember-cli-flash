import Ember from 'ember';
import customComputed from '../utils/computed';
import computed from 'ember-new-computed';

const {
  Evented,
  on,
  run,
  get,
  set
} = Ember;

export default Ember.Object.extend(Evented, {
  queue: computed.readOnly('flashService.queue'),
  totalTimeout: customComputed.add('timeout', 'extendedTimeout').readOnly(),
  timer: null,
  exitTimer: null,
  exiting: false,

  destroyMessage() {
    const queue = get(this, 'queue');

    if (queue) {
      queue.removeObject(this);
    }

    this.destroy();
    this.trigger('didDestroyMessage');
  },

  exitMessage() {
    set(this, 'exiting', true);

    this._cancelTimer('exitTimer');
    this.trigger('didExitMessage');
  },

  willDestroy() {
    const timers = [ 'timer', 'exitTimer' ];

    timers.forEach((timer) => {
      this._cancelTimer(timer);
    });

    this._super(...arguments);
  },

  // private
  _guid: customComputed.guidFor('message').readOnly(),

  _setInitialState: on('init', function() {
    if (get(this, 'sticky')) {
      return;
    }

    this._setTimer('exitTimer', 'exitMessage', get(this, 'timeout'));
    this._setTimer('timer', 'destroyMessage', get(this, 'totalTimeout'));
  }),

  _setTimer(name, methodName, timeout) {
    const timer = run.later(this, methodName, timeout);

    set(this, name, timer);
  },

  _cancelTimer(name) {
    const timer = get(this, name);

    if (timer) {
      run.cancel(timer);
      set(this, name, null);
    }
  }
});
