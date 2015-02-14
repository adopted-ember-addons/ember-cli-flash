import Ember from 'ember';

var computed = Ember.computed;
var get      = Ember.get;
var on       = Ember.on;

export default Ember.Component.extend({
  classNames:        [ 'alert', 'flashMessage' ],
  classNameBindings: [ 'alertType' ],

  alertType: computed('flash.type', function() {
    var flashType = get(this, 'flash.type');

    return 'alert-' + flashType;
  }),

  flashType: computed('flash.type', function() {
    var flashType = get(this, 'flash.type');

    return flashType.classify();
  }),

  click: function() {
    this._destroyFlashMessage();
  },

  //private
  _destroyOnTeardown: on('willDestroyElement', function() {
    this._destroyFlashMessage();
  }),

  _destroyFlashMessage: function() {
    var flash = get(this, 'flash');

    if (flash) {
      flash.destroyMessage();
    }
  }
});
