import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import FlashMessage from 'ember-cli-flash/flash/object';
import sinon from 'sinon';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

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

if (parseFloat(Ember.VERSION) > 2.0) {
  test('flash message is removed after timeout', function(assert) {
    assert.expect(3);

    let destroyMessage = sinon.spy();
    
    this.set('flash', FlashMessage.create({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
      destroyMessage
    }));

    this.render(hbs`
      {{#flash-message flash=flash as |component flash|}}
        {{flash.message}}
      {{/flash-message}}
    `);

    assert.equal(this.$().text().trim(), 'hi');
    assert.notOk(destroyMessage.calledOnce, 'flash has not been destroyed yet');

    return wait().then(() => {
      assert.ok(destroyMessage.calledOnce, 'flash is destroyed after timeout');
    });
  });

  test('flash message is removed after timeout', function(assert) {
    assert.expect(3);

    let destroyMessage = sinon.spy();

    this.set('flash', FlashMessage.create({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
      destroyMessage
    }));

    this.render(hbs`
      {{#flash-message flash=flash as |component flash|}}
        <span id="testFlash">{{flash.message}}</span>
      {{/flash-message}}
    `);

    assert.equal(this.$().text().trim(), 'hi');

    this.$('#testFlash').mouseenter();

    assert.notOk(
      destroyMessage.calledOnce,
      'flash is not destroyed after enough elapsed time'
    );

    this.$('#testFlash').mouseleave();
        
    return wait().then(() => {
      assert.ok(
        destroyMessage.calledOnce,
        'flash waits remaining time from original timeout'
      );
    });
  });

  test('a custom component can use the close closure action', function(assert) {
    assert.expect(3);

    let destroyMessage = sinon.spy();
    this.set('flash', FlashMessage.create({
      message: 'flash message content',
      sticky: true,
      destroyOnClick: false,
      destroyMessage
    }));

    this.render(hbs`
      {{#flash-message flash=flash as |component flash close|}}
        {{flash.message}}
        <a href="#" {{action close}}>close</a>
      {{/flash-message}}
    `);

    assert.notOk(destroyMessage.calledOnce, 'flash has not been destroyed yet');
    this.$(":contains(flash message content)").click();
    assert.notOk(destroyMessage.calledOnce, 'flash has not been destroyed yet');
    this.$(":contains(close)").click();
    assert.ok(destroyMessage.calledOnce, 'flash is destroyed after clicking close');
  });
}
