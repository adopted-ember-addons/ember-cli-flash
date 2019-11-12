# Arbitrary options

You can also add arbitrary options to messages:

{{#docs-snippet name='usage-8.js'}}
  import { get } from '@ember/object';

  get(this, 'flashMessages').success('Cool story bro', {
    someOption: 'hello'
  });

  get(this, 'flashMessages').add({
    message: 'hello',
    type: 'foo',
    componentName: 'some-component',
    content: customContent
  });
{{/docs-snippet}}

## Example use case

This makes use of the [component helper](http://emberjs.com/blog/2015/03/27/ember-1-11-0-released.html#toc_component-helper), allowing the template that ultimately renders the flash to be dynamic:

{{#docs-snippet name='usage-9.hbs'}}
  {{#each flashMessages.queue as |flash|}}
    {{#flash-message flash=flash as |component flash|}}
      {{#if flash.componentName}}
        {{component flash.componentName content=flash.content}}
      {{else}}
        <h6>{{component.flashType}}</h6>
        <p>{{flash.message}}</p>
      {{/if}}
    {{/flash-message}}
  {{/each}}
{{/docs-snippet}}
