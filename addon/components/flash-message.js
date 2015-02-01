import Ember from 'ember';

var { computed, get } = Ember.computed;

export default Ember.Component.extend({
  classNames:        [ 'alert', 'flashMessage' ],
  classNameBindings: [ 'alertType' ],

  alertType: computed('flash.type', function() {
    let flashType = get(this, 'flash.type');

    return `alert-${flashType}`;
  }),

  flashType: computed('flash.type', function() {
    let flashType = get(this, 'flash.type');

    return flashType.classify();
  }),

  click() {
    let flash = get(this, 'flash');

    flash.destroyMessage();
  }
});
