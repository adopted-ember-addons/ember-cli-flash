# Acceptance / Integration tests

When you install the addon, it should automatically generate a helper located at `tests/helpers/flash-message.js`. You can do this manually as well:

{{#docs-snippet name="generator" language="shell"}}
  ember generate ember-cli-flash
{{/docs-snippet}}

This also adds the helper to `tests/test-helper.js`. You won't actually need to import this into your tests, but it's good to know what the blueprint does. Basically, the helper overrides the `_setInitialState` method so that the flash messages behave intuitively in a testing environment.

An example acceptance test:

{{#docs-snippet name="example-1.js"}}
  // tests/acceptance/foo-test.js

  test('flash message is rendered', function(assert) {
    assert.expect(1);
    visit('/');

    andThen(() => assert.ok(find('.alert.alert-success').length));
  });
{{/docs-snippet}}

An example integration test:

{{#docs-snippet name="example-2.js"}}
  // tests/integration/components/x-foo-test.js
  import { getOwner } from '@ember/application';

  moduleForComponent('x-foo', 'Integration | Component | x foo', {
    integration: true,
    beforeEach() {
      //We have to register any types we expect to use in this component
      const typesUsed = ['info', 'warning', 'success'];
      getOwner(this).lookup('service:flash-messages').registerTypes(typesUsed);
    }
  });

  test('it renders', function(assert) {
    ...
  });
{{/docs-snippet}}
