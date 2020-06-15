# Displaying flash messages

Then, to display somewhere in your app, add this to your template:

{{#docs-snippet name="example-1.hbs"}}
  {{#each flashMessages.queue as |flash|}}
    {{flash-message flash=flash}}
  {{/each}}
{{/docs-snippet}}

It also accepts your own template:

{{#docs-snippet name="example-2.hbs"}}
  {{#each flashMessages.queue as |flash|}}
    {{#flash-message flash=flash as |c flash|}}
      <h6>{{c.flashType}}</h6>
      <p>{{flash.message}}</p>
      {{#if c.showProgressBar}}
        <div class="alert-progress">
          <div class="alert-progressBar" style="{{c.progressDuration}}"></div>
        </div>
      {{/if}}
    {{/flash-message}}
  {{/each}}
{{/docs-snippet}}

## Custom `close` action
The `close` action is always passed to the component whether it is used or not. It can be used to implement your own close button, such as an `x` in the top-right corner.

When using a custom `close` action, you will want to set `destroyOnClick=false` to override the default (`destroyOnClick=true`). You could do this globally in `flashMessageDefaults`.

{{#docs-snippet name="example-3.hbs"}}
  {{#each flashMessages.queue as |flash|}}
    {{#flash-message flash=flash as |c flash close|}}
      {{flash.message}}
      <a href="#" {{action close}}>x</a>
    {{/flash-message}}
  {{/each}}
{{/docs-snippet}}

## Styling with Foundation or Bootstrap
By default, flash messages will have Bootstrap style class names. If you want to use Foundation, simply specify the `messageStyle` on the component:

{{#docs-snippet name="example-4.hbs"}}
  {{#each flashMessages.queue as |flash|}}
    {{flash-message flash=flash messageStyle='foundation'}}
  {{/each}}
{{/docs-snippet}}

## Sort messages by priority
To display messages sorted by priority, add this to your template:

{{#docs-snippet name="example-5.hbs"}}
  {{#each flashMessages.arrangedQueue as |flash|}}
    {{flash-message flash=flash}}
  {{/each}}
{{/docs-snippet}}

## Rounded corners (Foundation)
To add `radius` or `round` type corners in Foundation:

{{#docs-snippet name="example-6.hbs"}}
  {{#each flashMessages.arrangedQueue as |flash|}}
    {{flash-message flash=flash messageStyle='foundation' class='radius'}}
  {{/each}}
{{/docs-snippet}}

{{#docs-snippet name="example-7.hbs"}}
  {{#each flashMessages.arrangedQueue as |flash|}}
    {{flash-message flash=flash messageStyle='foundation' class='round'}}
  {{/each}}
{{/docs-snippet}}

## Custom flash message component
If the provided component isn't to your liking, you can easily create your own. All you need to do is pass in the `flash` object to that component:

{{#docs-snippet name="example-8.hbs"}}
  {{#each flashMessages.queue as |flash|}}
    {{custom-component flash=flash}}
  {{/each}}
{{/docs-snippet}}
