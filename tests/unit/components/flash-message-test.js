import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';
import FlashMessage from 'ember-cli-flash/flash/object';

const {
  run,
  get,
  set
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
    run(() => {
      flash.destroy();
    });

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

  const component = this.subject({ flash });
  this.render();
  assert.equal(get(component, 'exiting'), false, 'it initializes with `exiting` set to false');

  run(() => {
    set(flash, 'exiting' , true);
    assert.ok(get(component, 'exiting'), 'it sets `exiting` to true when the flash object is exiting');
  });
});
