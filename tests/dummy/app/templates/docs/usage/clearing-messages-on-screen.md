# Clearing all messages on screen

It's best practice to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

{{#docs-snippet name='usage-10.js'}}
  import { get } from '@ember/object';

  get(this, 'flashMessages').clearMessages();
{{/docs-snippet}}
