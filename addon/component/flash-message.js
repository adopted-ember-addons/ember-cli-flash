import Ember from 'ember';

var computed = Ember.computed;
var get      = Ember.get;

export default Ember.Component.extend({
  classNames:        [ 'alert' ],
  classNameBindings: [ 'alertType' ],

  alertType: computed('flash.type', function() {
    let flashType = get(this, 'flash.type');
    return `alert-${flashType}`;
  }),

  click() {
    let flash = get(this, 'flash');
    flash.destroyMessage();
  }
});
