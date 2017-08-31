import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import FlashMessage from 'ember-cli-flash/flash/object';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

const { run: { later } } = Ember;

const timeoutDefault = 1000;

moduleForComponent('flash-message', 'Integration | Component | flash message', {
  integration: true
});

test('it renders a flash message', function(assert) {
  this.set('flash', FlashMessage.create({ message: 'hi', sticky: true }));

  this.render(hbs`
    {{#flash-message flash=flash as |component flash|}}
      {{flash.message}}
    {{/flash-message}}
  `);

  assert.equal(this.$().text().trim(), 'hi');
  assert.ok(this.$('.alert:eq(0)').hasClass('flash-message'));
});

test('it does not error when quickly removed from the DOM', function(assert) {
  this.set('flash', FlashMessage.create({ message: 'hi', sticky: true }));
  this.set('flag', true);

  this.render(hbs`
    {{#if flag}}
      {{#flash-message flash=flash as |component flash|}}
        {{flash.message}}
      {{/flash-message}}
    {{/if}}
  `);

  this.set('flag', false);

  assert.ok(this.get('flash').isDestroyed, 'Flash Object isDestroyed');
});

test('flash message is removed after timeout', function(assert) {
  assert.expect(3);

  this.set('flash', FlashMessage.create({
    message: 'hi',
    sticky: false,
    timeout: timeoutDefault
  }));

  this.render(hbs`
    {{#flash-message flash=flash as |component flash|}}
      {{flash.message}}
    {{/flash-message}}
  `);

  assert.equal(this.$().text().trim(), 'hi');
  assert.notOk(this.get('flash').isDestroyed, 'Flash is not destroyed immediately');

  return wait().then(() => {
    assert.ok(this.get('flash').isDestroyed, 'Flash Object is destroyed');
  });
});

test('flash message is removed after timeout if mouse enters', function(assert) {
  assert.expect(3);

  let flashObject = FlashMessage.create({
    message: 'hi',
    sticky: false,
    timeout: timeoutDefault
  });

  this.set('flash', flashObject);

  this.render(hbs`
    {{#flash-message elementId="testFlash" flash=flash as |component flash|}}
      {{flash.message}}
    {{/flash-message}}
  `);

  assert.equal(this.$().text().trim(), 'hi');
  this.$('#testFlash').mouseenter();

  assert.notOk(flashObject.isDestroyed, 'Flash Object is not destroyed');
  this.$('#testFlash').mouseleave();

  later(() => {
    assert.ok(flashObject.isDestroyed, 'Flash Object is destroyed');
  }, 1001);
  return wait();
});

test('a custom component can use the close closure action', function(assert) {
  assert.expect(3);

  this.set('flash', FlashMessage.create({
    message: 'flash message content',
    sticky: true,
    destroyOnClick: false
  }));

  this.render(hbs`
    {{#flash-message flash=flash as |component flash close|}}
      {{flash.message}}
      <a href="#" {{action close}}>close</a>
    {{/flash-message}}
  `);

  assert.notOk(this.get('flash').isDestroyed, 'flash has not been destroyed yet');
  this.$(":contains(flash message content)").click();
  assert.notOk(this.get('flash').isDestroyed, 'flash has not been destroyed yet');
  this.$(":contains(close)").click();
  assert.ok(this.get('flash').isDestroyed, 'flash is destroyed after clicking close');
});

test('exiting class is applied for sticky messages', function(assert) {
  assert.expect(3);
  let flashObject =  FlashMessage.create({
    message: 'flash message content',
    sticky: true,
    extendedTimeout: 100
  });

  this.set('flash', flashObject);

  this.render(hbs`
    {{#flash-message flash=flash as |component flash|}}
      <span>{{flash.message}}</span>
    {{/flash-message}}
  `);

  const flashDiv = this.$('.alert:eq(0)');
  flashDiv.click();
  assert.ok(flashDiv.length, 'Flash message is shown');
  assert.ok(flashDiv.hasClass('exiting'), 'exiting class is applied');

  later(() => {
    assert.ok(flashObject.isDestroyed, 'Flash Object is destroyed');
  }, 101);
  return wait();
});
