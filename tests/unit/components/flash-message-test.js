import $ from 'jquery';
import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import FlashObject from 'ember-cli-flash/flash/object';

const {
  run,
  get
} = Ember;
let flash;

moduleForComponent('flash-message', 'FlashMessageComponent', {
  unit: true,

  beforeEach() {
    flash = FlashObject.create({
      message: 'test',
      type: 'test',
      timeout: 50,
      extendedTimeout: 500,
      showProgress: true
    });
  },

  afterEach() {
    flash = null;
  }
});

test('it renders with the right props', function(assert) {
  assert.expect(5);

  const component = this.subject({ flash });
  assert.equal(get(component, 'active'), false, 'it initializes with `active` set to false');

  this.render();
  assert.equal(get(component, 'alertType'), 'alert alert-test', 'it has the right `alertType`');
  assert.equal(get(component, 'flashType'), 'Test', 'it has the right `flashType`');
  assert.equal(get(component, 'progressDuration'), `transition-duration: ${flash.get('timeout')}ms`, 'it has the right `progressDuration`');

  run.next(() => {
    assert.equal(get(component, 'active'), true, 'it sets `active` to true after rendering');
  });
});

test('exiting the flash object sets exiting on the component', function(assert) {
  assert.expect(2);

  const done = assert.async();
  const component = this.subject({ flash });

  run(() => {
    this.render();
    assert.equal(get(component, 'exiting'), false, 'it initializes with `exiting` set to false');
    run.later(() => {
      assert.ok(get(component, 'exiting'), 'it sets `exiting` to true when the flash object is exiting');
      done();
    }, 51);
  });
});

test('exiting the flash object sets exiting when sticky & clicking to remove', function(assert) {
  assert.expect(3);
  flash.sticky = true;

  const done = assert.async();
  const component = this.subject({ flash });

  run(() => {
    this.render();
    assert.equal(get(component, 'exiting'), false, 'it initializes with `exiting` set to false');
    $('.alert').click();
    assert.ok(get(component, 'exiting'), 'it sets `exiting` to true when the flash object is exiting');

    run.later(() => {
      assert.ok(get(component, 'flash').isDestroyed, 'it destroys the flash object on click');
      done();
    }, 551);
  });
});

test('it destroys the flash object on click', function(assert) {
  assert.expect(1);
  const done = assert.async();
  const component = this.subject({ flash });
  this.render();

  $('.alert').click();
  run.later(() => {
    assert.ok(get(component, 'flash').isDestroyed, 'it destroys the flash object on click');
    done();
  }, 551);
});

test('it does not destroy the flash object when `flash.destroyOnClick` is false', function(assert) {
  assert.expect(1);
  flash.destroyOnClick = false;
  const done = assert.async();
  const component = this.subject({ flash });
  this.render();

  $('.alert').click();
  run.later(() => {
    assert.notOk(get(component, 'flash').isDestroyed, 'it does not destroy the flash object on click');
    done();
  }, 25);
});
