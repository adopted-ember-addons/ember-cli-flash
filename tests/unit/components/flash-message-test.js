import { run } from '@ember/runloop';
import { set, get } from '@ember/object';
import FlashMessage from 'ember-cli-flash/flash/object';
import wait from 'ember-test-helpers/wait';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let flash;

module('Unit | Component | flash-message', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    flash = FlashMessage.create({
      message: 'test',
      type: 'test',
      timeout: 50,
      extendedTimeout: 5000,
      showProgress: true
    });
  });

  hooks.afterEach(function() {
    flash = null;
  });
  
  test('it renders with the right props', async function(assert) {
    assert.expect(5);
  
    let component = this.owner.factoryFor('component:flash-message').create();
    component.set('flash', flash);
    assert.equal(get(component, 'active'), false, 'it initializes with `active` set to false');
  
    component.didInsertElement();
    assert.equal(get(component, 'alertType'), 'alert alert-test', 'it has the right `alertType`');
    assert.equal(get(component, 'flashType'), 'Test', 'it has the right `flashType`');
    assert.equal(get(component, 'progressDuration'), `transition-duration: ${flash.get('timeout')}ms`, 'it has the right `progressDuration`');
  
    await wait();
    assert.equal(get(component, 'active'), true, 'it sets `active` to true after rendering');
  });
  
  test('exiting the flash object sets exiting on the component', function(assert) {
    assert.expect(2);
  
    let component = this.owner.factoryFor('component:flash-message').create();
    component.set('flash', flash);
    component.didInsertElement();
    assert.equal(get(component, 'exiting'), false, 'it initializes with `exiting` set to false');
  
    run(() => {
      set(flash, 'exiting' , true);
      assert.ok(get(component, 'exiting'), 'it sets `exiting` to true when the flash object is exiting');
    });
  });
  
  test('it destroys the flash object on click', function(assert) {
    assert.expect(1);
    flash.set('extendedTimeout', 0);
    let component = this.owner.factoryFor('component:flash-message').create();
    component.set('flash', flash);
    component.didInsertElement();
  
    run(() => component.click());
    assert.ok(get(component, 'flash').isDestroyed, 'it destroys the flash object on click');
  });
  
  test('it does not destroy the flash object when `flash.destroyOnClick` is false', function(assert) {
    assert.expect(1);
    flash.destroyOnClick = false;
    let component = this.owner.factoryFor('component:flash-message').create();
    component.set('flash', flash);
    component.didInsertElement();
  
    run(() => component.click());
    assert.notOk(get(component, 'flash').isDestroyed, 'it does not destroy the flash object on click');
  });
});
