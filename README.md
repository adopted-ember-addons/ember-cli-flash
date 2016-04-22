# ⚡ ember-cli-flash ⚡️
*Simple, highly configurable flash messages for ember-cli.*

[![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![Build Status](https://travis-ci.org/poteto/ember-cli-flash.svg)](https://travis-ci.org/poteto/ember-cli-flash) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-flash.svg)](http://emberobserver.com/addons/ember-cli-flash) [![Code Climate](https://codeclimate.com/github/poteto/ember-cli-flash/badges/gpa.svg)](https://codeclimate.com/github/poteto/ember-cli-flash) 

This `ember-cli` addon adds a simple flash message service and component to your app. Just inject with `Ember.inject.service` and you're good to go!

## Warning

This is the readme for the `2.0.0-alpha` series, some information might be incorrect or outdated. For prior versions, please refer to [previous tags](https://github.com/poteto/ember-cli-flash/tags). Due to the use of contextual components, the `2.x` series of ember-cli-flash will require the use of the `ember-hash-helper-polyfill` addon if you are on Ember < 2.3.

## Installation
You can install either with `ember install`:

```
ember install ember-cli-flash
```

## Compatibility
This addon is tested against the `release`, `beta` and `canary` channels, `~1.11.0`, `1.12.1` and `2.x`. Because this addon makes use of attribute bindings, which were introduced in ember `1.11.0`, earlier versions of ember are not compatible with the latest version. 

## Usage
Usage is very simple. First, add one of the [template examples](#displaying-flash-messages) to your app, or use the default:

```hbs
{{flash-messages flashes=flashMessages.queue}}
```

Then, inject the `flashMessages` service and use one of its convenience methods:

```js
export default Ember.Component.extend({
  flashMessages: Ember.inject.service()
})
```

### Convenience methods
You can quickly add flash messages using these methods from the service:

- `.success`
- `.warning`
- `.info`
- `.danger`
- `.alert`
- `.secondary`

You can take advantage of Promises, and their `.then` and `.catch` methods. To add a flash message after saving a model (or when it fails):

```js
actions: {
  saveFoo() {
    const flashMessages = Ember.get(this, 'flashMessages');

    Ember.get(this, 'model')
      .save()
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

### Custom messages
If the convenience methods don't fit your needs, you can add custom messages with `add`:

```js
Ember.get(this, 'flashMessages').add({
  message: 'Custom message'
});
```

#### Custom messages API
You can also pass in options to custom messages:

```js
Ember.get(this, 'flashMessages').add({
  message: 'I like alpacas',
  type: 'alpaca',
  timeout: 500,
  priority: 200,
  sticky: true,
  showProgress: true,
  extendedTimeout: 500
});

Ember.get(this, 'flashMessages').success('This is amazing', {
  timeout: 100,
  priority: 100,
  sticky: false,
  showProgress: true
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

- `extendedTimeout?: number`

  Default: `0`

  Number of milliseconds before a flash message is removed to add the class 'exiting' to the element.  This can be used to animate the removal of messages with a transition.

### Arbitrary options
You can also add arbitrary options to messages:

```js
Ember.get(this, 'flashMessages').success('Cool story bro', {
  someOption: 'hello'
});

Ember.get(this, 'flashMessages').add({
  message: 'hello',
  type: 'foo',
  componentName: 'some-component',
  content: customContent
});
```

### Clearing all messages on screen
It's best practise to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

```js
Ember.get(this, 'flashMessages').clearMessages();
```

## Service defaults 
In `config/environment.js`, you can override service defaults in the `flashMessageDefaults` object:

```js
module.exports = function(environment) {
  var ENV = {
    flashMessageDefaults: {
      // flash message defaults
      timeout: 5000,
      extendedTimeout: 0,
      priority: 200,
      sticky: true,
      showProgress: true,

      // service defaults
      type: 'alpaca',
      types: [ 'alpaca', 'notice', 'foobar' ],
      preventDuplicates: false
    }
  }
}
```

See the [options](#options) section for information about flash message specific options. 

- `type?: string`

  Default: `info`

  When adding a custom message with `add`, if no `type` is specified, this default is used.

- `types?: array`

  Default: `[ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ]`

  This option lets you specify exactly what types you need, which means in the above example, you can do `Ember.get('flashMessages').{alpaca,notice,foobar}`. 

- `preventDuplicates?: boolean`

  Default: `false`

  If `true`, only 1 instance of a flash message (based on its `message`) can be added at a time. For example, adding two flash messages with the message `"Great success!"` would only add the first instance into the queue, and the second is ignored.

## Displaying flash messages
Then, to display somewhere in your app, add this to your template:

```hbs
{{flash-messages flashes=flashMessages.queue}}
```

To display messages sorted by priority, used `arrangedQueue`:

```hbs
{{flash-messages flashes=flashMessages.arrangedQueue}}
```

It also accepts your own template. If the provided component isn't to your liking, you can easily create your own instead of using the contextual component:

```hbs
{{#flash-messages flashes=flashMessages.arrangedQueue as |flash|}}
  {{#flash.component class=(concat "alert alert-" flash.type) click=(action flash.close) as |flashMessage|}}
    <h6>{{flashMessage.type}}</h6>
    <p>{{flashMessage.message}}</p>
    {{#if flashMessage.showProgressBar}}
      <div class="alert-progress">
        <div class="alert-progressBar" style="{{flashMessage.progressDuration}}"></div>
      </div>
    {{/if}}
  {{/flash.component}}
{{/flash-messages}}
```

## Testing
When you install the addon, it should automatically generate a helper located at `tests/helpers/flash-message.js`. You can do this manually as well:

```shell
$ ember generate ember-cli-flash
```

This also adds the helper to `tests/test-helper.js`. You won't actually need to import this into your tests, but it's good to know what the blueprint does. Basically, the helper overrides the `_setInitialState` method so that the flash messages behave intuitively in a testing environment. 

#### An example acceptance test

```js
// tests/acceptance/foo-test.js

test('flash message is rendered', function(assert) {
  assert.expect(1);
  visit('/');

  andThen(() => assert.ok(find('.alert.alert-success')));
});
```

#### An example integration test

```javascript
// tests/integration/components/x-foo-test.js
import Ember from 'ember';

moduleForComponent('x-foo', 'Integration | Component | x foo', {
  integration: true,
  beforeEach() {
    //We have to register any types we expect to use in this component
    const typesUsed = ['info', 'warning', 'success'];
    Ember.getOwner(this).lookup('service:flash-messages').registerTypes(typesUsed);
  }
});

test('it renders', function(assert) {
  ...
});
```

#### An example unit test

```js
// tests/unit/route/foo-test.js
import Ember from 'ember';

moduleFor('route:foo', 'Unit | Route | foo', {
  needs: ['service:flash-messages'],
  beforeEach() {
    //We have to register any types we expect to use in this component
    const typesUsed = ['warning', 'success'];
    Ember.getOwner(this).lookup('service:flash-messages').registerTypes(typesUsed);
  }
});

test('it ...', function(assert) {
  ...
});
```

## License
[MIT](LICENSE.md)

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
