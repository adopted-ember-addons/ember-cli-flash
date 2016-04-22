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
  assert.expect(3);

  const component = this.subject({ flash });
  assert.equal(get(component, 'isActive'), false, 'it initializes with `isActive` set to false');

  this.render();
  assert.equal(get(component, 'progressDuration'), `transition-duration: ${flash.get('timeout')}ms`, 'it has the right `progressDuration`');

  run.next(() => {
    assert.equal(get(component, 'isActive'), true, 'it sets `isActive` to true after rendering');
  });
});

test('exiting the flash object sets `isExiting` on the component', function(assert) {
  assert.expect(2);

  const component = this.subject({ flash });
  this.render();
  assert.equal(get(component, 'isExiting'), false, 'it initializes with `isExiting` set to false');

  run(() => {
    set(flash, 'isExiting' , true);
    assert.ok(get(component, 'isExiting'), 'it sets `isExiting` to true when the flash object is exiting');
  });
});
