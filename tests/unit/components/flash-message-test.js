import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('flash-message', 'FlashMessageComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component.state, 'preRender');

  // render the component on the page
  this.render();
  assert.equal(component.state, 'inDOM');
});
