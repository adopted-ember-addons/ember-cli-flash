# Returning flash object

The flash message service is designed to be Fluent, allowing you to chain methods on the service easily. The service should handle most cases but if you want to access the flash object directly, you can use the `getFlashObject` method:

{{#docs-snippet name='usage-11.js'}}
  import { get } from '@ember/object';

  const flashObject = get(this, 'flashMessages').add({
    message: 'hola',
    type: 'foo'
  }).getFlashObject();
{{/docs-snippet}}

You can then manipulate the `flashObject` directly. Note that `getFlashObject` must be the last method in your chain as it returns the flash object directly.
