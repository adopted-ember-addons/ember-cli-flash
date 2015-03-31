# ember-cli-flash
*Simple, highly configurable flash messages for ember-cli.*

[![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![Build Status](https://travis-ci.org/poteto/ember-cli-flash.svg)](https://travis-ci.org/poteto/ember-cli-flash) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-flash.svg)](http://emberobserver.com/addons/ember-cli-flash) [![Code Climate](https://codeclimate.com/github/poteto/ember-cli-flash/badges/gpa.svg)](https://codeclimate.com/github/poteto/ember-cli-flash) [![Circle CI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=svg)](https://circleci.com/gh/poteto/ember-cli-flash)

[Statistics for `ember-cli-flash`](http://www.npm-stats.com/~packages/ember-cli-flash)

This `ember-cli` addon adds a simple flash message service to your app. It's injected into all `Controllers`, `Routes`, `Views` and `Components` by default ([you can change this](#service-defaults)), or lazily injected with `Ember.inject.service`.

## Installation
You can install either with `ember install:addon`:

```shell
ember install:addon ember-cli-flash
```

or `npm`:

```shell
npm install ember-cli-flash --save
```

## Usage
Usage is very simple. From within the factories you injected to (defaults to `Controller`, `Route`, `View` and `Component`):

### Convenience methods (Bootstrap / Foundation alerts)
You can quickly add flash messages using these methods from the service:

#### Bootstrap
- `.success`
- `.warning`
- `.info`
- `.danger`

#### Foundation
- `.success`
- `.warning`
- `.info`
- `.alert`
- `.secondary`

These will add the appropriate classes to the flash message component for styling in Bootstrap or Foundation. For example:

```javascript
// Bootstrap: the flash message component will have 'alert alert-success' classes
// Foundation: the flash message component will have 'alert-box success' classes
Ember.get(this, 'flashMessages').success('Success!');
```

### Custom messages
If the convenience methods don't fit your needs, you can add custom messages with `add`:

```javascript
Ember.get(this, 'flashMessages').add({
  message: 'Custom message'
});
```

#### Custom messages API
You can also pass in options to custom messages:

```javascript
Ember.get(this, 'flashMessages').add({
  message      : 'I like alpacas',
  type         : 'alpaca'
  timeout      : 500,
  priority     : 200,
  sticky       : true,
  showProgress : true
});

Ember.get(this, 'flashMessages').success('This is amazing', {
  timeout      : 100,
  priority     : 100,
  sticky       : false,
  showProgress : true
});
```

- `message: string`
  
  Required. The message that the flash message displays.

- `type?: string`
  
  Default: `info`

  This is mainly used for styling. The flash message's `type` is set as a class name on the rendered component, together with a prefix. The rendered class name depends on the message type that was passed into the component.

- `timeout?: number`

  Default: `3000`

  Number of milliseconds before a flash message is automatically removed.

- `priority?: number`
  
  Default: `100`

  Higher priority messages appear before low priority messages. The best practise is to use priority values in multiples of `100` (`100` being the lowest priority).

- `sticky?: boolean`
  
  Default: `false`

  By default, flash messages disappear after a certain amount of time. To disable this and make flash messages permanent (they can still be dismissed by click), set `sticky` to true.

- `showProgress?: boolean`
  
  Default: `false`

  To show a progress bar in the flash message, set this to true.

### Service defaults 
In `config/environment.js`, you can override service defaults in the `flashMessageDefaults` object:

```javascript
module.exports = function(environment) {
  var ENV = {
    flashMessageDefaults: {
      timeout            : 5000,
      priority           : 200,
      sticky             : true,
      showProgress       : true,
      type               : 'alpaca',
      types              : [ 'alpaca', 'notice', 'foobar' ],
      injectionFactories : [ 'route', 'controller', 'view', 'component' ]
    }
  }
}
```

See the [options](#options) section for detailed option information. This lets you override defaults for various options – most notably, you can specify exactly what types you need, which means in the above example, you can do `Ember.get('flashMessages').{alpaca,notice,foobar}`. 

#### Injection factories
The key `injectionFactories` lets you choose which factories the service injects itself into. 
If you only need to access the flash message service from inside `controllers`, you can do so by changing the `injectionFactories` prop to `[ 'controller' ]`. Note that this will also work with any valid registry name on the container, e.g. `[ 'component:foo', 'controller:bar', 'route:baz' ]`.

##### Lazy service injection
If you're using Ember `1.10.0` or higher, you can opt to inject the service manually on any `Ember.Object` registered in the container:

```javascript
export default {
  flashMessages: Ember.inject.service()
}
```

### Clearing all messages on screen
It's best practise to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

```javascript
Ember.get(this, 'flashMessages').clearMessages();
```

### Promises
You can take advantage of Promises, and their `.then` and `.catch` methods. To add a flash message after saving a model (or when it fails):

```javascript
actions: {
  saveFoo() {
    const flashMessages = Ember.get(this, 'flashMessages');

    Ember.get(this, 'model').save()
    .then((res) => {
      flashMessages.success('Successfully saved!');
      doSomething(res);
    })
    .catch((err) => {
      flashMessages.danger('Something went wrong!');
      handleError(err);
    });
  }
}
```

## Displaying flash messages
Then, to display somewhere in your app, add this to your template:

```handlebars
{{#each flashMessages.queue as |flash|}}
  {{flash-message flash=flash}}
{{/each}}
```

It also accepts your own template:

```handlebars
{{#each flashMessages.queue as |flash|}}
  {{#flash-message flash=flash as |component flash|}}
    <h6>{{component.flashType}}</h6>
    <p>{{flash.message}}</p>
    {{#if component.showProgressBar}}
      <div class="alert-progress">
        <div class="alert-progressBar" {{bind-attr style="component.progressDuration"}}></div>
      </div>
    {{/if}}
  {{/flash-message}}
{{/each}}
```

### Styling with Foundation or Boostrap
By default, flash messages will have Bootstrap style class names. If you want to use Foundation, simply specify the `messageStyle` on the component:

```handlebars
{{#each flashMessages.queue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation'}}
{{/each}}
```

### Sort messages by priority
To display messages sorted by priority, add this to your template:

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  {{flash-message flash=flash}}
{{/each}}
```

### Rounded corners (Foundation)
To add `radius` or `round` type corners in Foundation:

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation' class='radius'}}
{{/each}}
```

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation' class='round'}}
{{/each}}
```

## Styling
This addon is minimal and does not currently ship with a stylesheet. You can style flash messages by targetting the appropriate alert class (Foundation or Bootstrap) in your CSS.

## Contributing
Please read the [Contributing guidelines](CONTRIBUTING.md) for information on how to contribute.

## License
MIT

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
