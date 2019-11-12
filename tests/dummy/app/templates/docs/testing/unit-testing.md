# Unit testing

For unit tests that require the `flashMessages` service, you'll need to do a small bit of setup:

{{#docs-snippet name="example-1.js"}}
  import { getOwner } from '@ember/application';

  moduleFor('route:foo', 'Unit | Route | foo', {
    needs: ['service:flash-messages', 'config:environment'],
    beforeEach() {
      const typesUsed = ['warning', 'success'];
      getOwner(this).lookup('service:flash-messages').registerTypes(typesUsed);
    }
  });
{{/docs-snippet}}
