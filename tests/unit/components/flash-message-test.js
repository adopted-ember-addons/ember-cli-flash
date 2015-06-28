import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import FlashMessage from 'ember-cli-flash/flash/object';

const {
  run
} = Ember;

let flash;

moduleForComponent('flash-message', 'FlashMessageComponent', {
  unit: true,

  beforeEach() {
    flash = FlashMessage.create({
      message: 'test',
      type: 'test',
      timeout: 50,
      extendedTimeout: 5000,
      showProgress: true
    });
  },

  afterEach() {
    flash = null;
  }
});

test('it renders with the right props', function(assert) {
  assert.expect(7);

  const component = this.subject({ flash });
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
  assert.equal(component.get('active'), false);
  assert.equal(component.get('alertType'), 'alert alert-test');
  assert.equal(component.get('flashType'), 'Test');
  assert.equal(component.get('progressDuration'), `transition-duration: ${flash.get('timeout')}ms`);

  Ember.run.later(() => {
    assert.equal(component.get('active'), true);
  }, 0);
});

test('read only methods cannot be set', function(assert) {
  assert.expect(3);

  const component = this.subject({ flash });
  this.render();

  run(() => {
    component.setProperties({
      alertType: 'invalid',
      flashType: 'invalid',
      progressDuration: 'derp',
      extendedTimeout: 'nope'
    });
  });

  assert.deepEqual(component.get('flash'), flash);
  assert.throws(() => {
    component.set('showProgressBar', true);
  });
  assert.throws(() => {
    component.set('hasBlock', true);
  });
});

test('exiting the flash object sets exiting on the component', function(assert) {
  assert.expect(2);

  const component = this.subject({ flash });
  this.render();
  assert.ok(!component.get('exiting'));
  run(() => {
    flash.set('exiting' , true);
    assert.ok(component.get('exiting'));
  });
});
