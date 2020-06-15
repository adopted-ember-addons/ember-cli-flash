# Custom messages
If the convenience methods don't fit your needs, you can add custom messages with `add`:

{{#docs-snippet name='usage-4.js'}}
  import { get } from '@ember/object';

  get(this, 'flashMessages').add({
    message: 'Custom message'
  });
{{/docs-snippet}}

## Custom messages API
You can also pass in options to custom messages:

{{#docs-snippet name='usage-5.js'}}
  import { get } from '@ember/object';

  get(this, 'flashMessages').add({
    message: 'I like alpacas',
    type: 'alpaca',
    timeout: 500,
    priority: 200,
    sticky: true,
    showProgress: true,
    extendedTimeout: 500,
    destroyOnClick: false,
    onDestroy() {
      // behavior triggered when flash is destroyed
    }
  });

  get(this, 'flashMessages').success('This is amazing', {
    timeout: 100,
    priority: 100,
    sticky: false,
    showProgress: true
  });
{{/docs-snippet}}

- `message: string`

  Required when `preventDuplicates` is enabled. The message that the flash message displays.

- `type?: string`

  Default: `info`

  This is mainly used for styling. The flash message's `type` is set as a class name on the rendered component, together with a prefix. The rendered class name depends on the message type that was passed into the component.

- `timeout?: number`

  Default: `3000`

  Number of milliseconds before a flash message is automatically removed.

- `priority?: number`

  Default: `100`

  Higher priority messages appear before low priority messages. The best practise is to use priority values in multiples of `100` (`100` being the lowest priority). Note that you will need to {{docs-link 'modify your template' 'docs.displaying-flash-messages'}} for this work.

- `sticky?: boolean`

  Default: `false`

  By default, flash messages disappear after a certain amount of time. To disable this and make flash messages permanent (they can still be dismissed by click), set `sticky` to true.

- `showProgress?: boolean`

  Default: `false`

  To show a progress bar in the flash message, set this to true.

- `extendedTimeout?: number`

  Default: `0`

  Number of milliseconds before a flash message is removed to add the class 'exiting' to the element.  This can be used to animate the removal of messages with a transition.

- `destroyOnClick?: boolean`

  Default: `true`

  By default, flash messages will be destroyed on click.  Disabling this can be useful if the message supports user interaction.

- `onDestroy: function`

  Default: `undefined`

  A function to be called when the flash message is destroyed.
