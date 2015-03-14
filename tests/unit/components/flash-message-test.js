import {
  moduleForComponent,
  test
} from 'ember-qunit';
import FlashMessage from 'ember-cli-flash/flash/object';
import Ember from 'ember';

var flash;

moduleForComponent('flash-message', 'FlashMessageComponent', {
  beforeEach() {
    flash = FlashMessage.create({
      message  : 'test',
      type     : 'test',
      timeout  : 500,
      priority : 500
    });
  },

  afterEach() {
    flash = null;
    Ember.ENV.flashTheme = null;
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  const component = this.subject();
  assert.equal(component._state, 'preRender');

  // render the component on the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('#alertType returns the right type', function(assert) {
  assert.expect(1);

  const component = this.subject();
  component.set('flash', flash);

  this.render();
  assert.equal(component.get('alertType'), 'alert alert-test');
});

test('#alertType allows the messageStyle to be set', function(assert) {
  assert.expect(1);

  const component = this.subject();
  component.set('messageStyle', 'foundation');
  component.set('flash', flash);

  this.render();
  assert.equal(component.get('alertType'), 'alert-box test');
});

test('#alertType defaults to the config theme when not declared', function(assert) {
  assert.expect(1);

  const component = this.subject();
  Ember.ENV.flashTheme = 'foundation';
  component.set('flash', flash);

  this.render();
  assert.equal(component.get('alertType'), 'alert-box test');
});

test('#flashType returns the right classified alert type', function(assert) {
  assert.expect(1);

  const component = this.subject();
  component.set('flash', flash);

  this.render();
  assert.equal(component.get('flashType'), 'Test');
});
