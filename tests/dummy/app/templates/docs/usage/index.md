# Usage

Usage is very simple. First, add one of the {{docs-link 'template examples' 'docs.displaying-flash-messages'}} to your app. Then, inject the `flashMessages` service and use one of its convenience methods:

{{#docs-snippet name='usage-1.js'}}
  import Component from '@ember/component';
  import { inject } from '@ember/service';

  export default Component.extend({
    flashMessages: inject()
  });
{{/docs-snippet}}
