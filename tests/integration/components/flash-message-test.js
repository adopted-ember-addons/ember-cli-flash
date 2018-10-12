import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import FlashMessage from 'ember-cli-flash/flash/object';
import wait from 'ember-test-helpers/wait';
import { click, render, triggerEvent } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

const timeoutDefault = 1000;

module('Integration | Component | flash message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a flash message', async function(assert) {
    this.set('flash', FlashMessage.create({ message: 'hi', sticky: true }));
  
    await render(hbs`
      {{#flash-message flash=flash as |component flash|}}
        {{flash.message}}
      {{/flash-message}}
    `);
  
    assert.equal(this.element.textContent.trim(), 'hi');
    assert.dom('.alert').hasClass('flash-message');
  });
  
  test('it does not error when quickly removed from the DOM', async function(assert) {
    this.set('flash', FlashMessage.create({ message: 'hi', sticky: true }));
    this.set('flag', true);
  
    await render(hbs`
      {{#if flag}}
        {{#flash-message flash=flash as |component flash|}}
          {{flash.message}}
        {{/flash-message}}
      {{/if}}
    `);
  
    this.set('flag', false);
  
    return wait().then(() => {
      assert.ok(this.get('flash').isDestroyed, 'Flash Object isDestroyed');
    });
  });
  
  test('flash message is removed after timeout', async function(assert) {
    assert.expect(3);
  
    this.set('flash', FlashMessage.create({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault
    }));
  
    render(hbs`
      {{#flash-message flash=flash as |component flash|}}
        {{flash.message}}
      {{/flash-message}}
    `);
    assert.notOk(this.get('flash').isDestroyed, 'Flash is not destroyed immediately');
    await wait();
    assert.equal(this.element.textContent.trim(), 'hi');
  
    await wait();
    assert.ok(this.get('flash').isDestroyed, 'Flash Object is destroyed');
  });
  
  test('flash message is not removed after timeout if mouse enters', async function(assert) {
    assert.expect(2);
  
    let flashObject = FlashMessage.create({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault
    });
  
    this.set('flash', flashObject);
  
    render(hbs`
      {{#flash-message elementId="testFlash" flash=flash as |component flash|}}
        {{flash.message}}
      {{/flash-message}}
    `);

    await triggerEvent('#testFlash', 'mouseover');
    await wait();
    assert.notOk(flashObject.isDestroyed, 'Flash Object is not 44destroyed');
    await triggerEvent('#testFlash', 'mouseout');
  
    await wait();
    assert.ok(flashObject.isDestroyed, 'Flash Object is destroyed');
  });
  
  test('a custom component can use the close closure action', async function(assert) {
    assert.expect(3);
  
    this.set('flash', FlashMessage.create({
      message: 'flash message content',
      sticky: true,
      destroyOnClick: false
    }));
  
    await render(hbs`
      {{#flash-message flash=flash as |component flash close|}}
        {{flash.message}}
        <a role="close" href="#" {{action close}}>close</a>
      {{/flash-message}}
    `);
  
    assert.notOk(this.get('flash').isDestroyed, 'flash has not been destroyed yet');
    await click('.alert');
    assert.notOk(this.get('flash').isDestroyed, 'flash has not been destroyed yet');
    await click('[role="close"]');
    assert.ok(this.get('flash').isDestroyed, 'flash is destroyed after clicking close');
  });
  
  test('exiting class is applied for sticky messages', async function(assert) {
    assert.expect(3);
    let flashObject =  FlashMessage.create({
      message: 'flash message content',
      sticky: true,
      extendedTimeout: 100
    });
  
    this.set('flash', flashObject);
  
    await render(hbs`
      {{#flash-message flash=flash as |component flash|}}
        <span>{{flash.message}}</span>
      {{/flash-message}}
    `);
  
    await click('.alert');
    assert.dom('.alert').exists();
    assert.dom('.alert').hasClass('exiting');
  
    assert.ok(flashObject.isDestroyed, 'Flash Object is destroyed');
  });
});
