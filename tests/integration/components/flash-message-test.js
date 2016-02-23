import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import FlashMessage from 'ember-cli-flash/flash/object';

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
