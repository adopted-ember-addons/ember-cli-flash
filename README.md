# ember-cli-flash

![Download count all time](https://img.shields.io/npm/dt/ember-cli-flash.svg) [![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![CircleCI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=shield)](https://circleci.com/gh/poteto/ember-cli-flash) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-flash.svg)](http://emberobserver.com/addons/ember-cli-flash) [![Code Climate](https://codeclimate.com/github/poteto/ember-cli-flash/badges/gpa.svg)](https://codeclimate.com/github/poteto/ember-cli-flash)

*Simple, highly configurable flash messages for ember.*

This ember addon adds a flash message service and component to your app.

## Table of Contents
<!-- toc -->
- [Installation](#installation)
- [Compatibility](#compatibility)
- [Usage](#usage)
  * [Convenience methods (Bootstrap / Foundation alerts)](#convenience-methods-bootstrap--foundation-alerts)
    + [Bootstrap](#bootstrap)
    + [Foundation](#foundation)
  * [Custom messages](#custom-messages)
    + [Custom messages API](#custom-messages-api)
  * [Animated example](#animated-example)
  * [Arbitrary options](#arbitrary-options)
    + [Example use case](#example-use-case)
  * [Clearing all messages on screen](#clearing-all-messages-on-screen)
  * [Returning flash object](#returning-flash-object)
- [Service defaults](#service-defaults)
- [Displaying flash messages](#displaying-flash-messages)
  * [Custom `close` action](#custom-close-action)
  * [Styling with Foundation or Bootstrap](#styling-with-foundation-or-bootstrap)
  * [Sort messages by priority](#sort-messages-by-priority)
  * [Rounded corners (Foundation)](#rounded-corners-foundation)
  * [Custom flash message component](#custom-flash-message-component)
- [Acceptance / Integration tests](#acceptance--integration-tests)
- [Unit testing](#unit-testing)
- [Styling](#styling)
- [License](#license)
- [Contributors](#contributors)
<!-- tocstop -->

## Installation
```
ember install ember-cli-flash
```

## Compatibility
This addon is tested against the `release`, `beta` and `canary` channels, `~1.11.0`, and `1.12.1`. Because this addon makes use of attribute bindings, which were introduced in ember `1.11.0`, earlier versions of ember are not compatible with the latest version.

## Usage
Usage is very simple. First, add one of the [template examples](#displaying-flash-messages) to your app. Then, inject the `flashMessages` service and use one of its convenience methods:

```javascript
import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  flashMessages: inject()
});
```

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
this.flashMessages.success('Success!');
```

You can take advantage of Promises, and their `.then` and `.catch` methods. To add a flash message after saving a model (or when it fails):

```javascript
actions: {
  saveFoo() {
    const flashMessages = this.flashMessages;

    this.model
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

```javascript
this.flashMessages.add({
  message: 'Custom message'
});
```

#### Custom messages API
You can also pass in options to custom messages:

```javascript
this.flashMessages.add({
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

this.flashMessages.success('This is amazing', {
  timeout: 100,
  priority: 100,
  sticky: false,
  showProgress: true
});
```

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

  Higher priority messages appear before low priority messages. The best practise is to use priority values in multiples of `100` (`100` being the lowest priority). Note that you will need [modify your template](#sort-messages-by-priority) for this work.

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

### Animated example
To animate messages, set `extendedTimeout` to something higher than zero. Here we've chosen 500ms.

```javascript
module.exports = function(environment) {
  var ENV = {
    flashMessageDefaults: {
      extendedTimeout: 500
    }
  }
}
```

Then animate using CSS transitions, using the `.active` and `.active.exiting` classes.
```scss
.alert {
  opacity: 0;
  position: relative;
  left: 100px;

  transition: all 700ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &.active {
    opacity: 1;
    left: 0px;

    &.exiting {
      opacity: 0;
      left: 100px;
    }
  }
}
```

### Arbitrary options
You can also add arbitrary options to messages:

```javascript
this.flashMessages.success('Cool story bro', {
  someOption: 'hello'
});

this.flashMessages.add({
  message: 'hello',
  type: 'foo',
  componentName: 'some-component',
  content: customContent
});
```

#### Example use case
This makes use of the [component helper](http://emberjs.com/blog/2015/03/27/ember-1-11-0-released.html#toc_component-helper), allowing the template that ultimately renders the flash to be dynamic:

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} as |component flash|>
    {{#if flash.componentName}}
      {{component flash.componentName content=flash.content}}
    {{else}}
      <h6>{{component.flashType}}</h6>
      <p>{{flash.message}}</p>
    {{/if}}
  </FlashMessage>
{{/each}}
```

### Clearing all messages on screen
It's best practice to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

```javascript
this.flashMessages.clearMessages();
```

### Returning flash object
The flash message service is designed to be Fluent, allowing you to chain methods on the service easily. The service should handle most cases but if you want to access the flash object directly, you can use the `getFlashObject` method:

```javascript
const flashObject = this.flashMessages.add({
  message: 'hola',
  type: 'foo'
}).getFlashObject();
```

You can then manipulate the `flashObject` directly. Note that `getFlashObject` must be the last method in your chain as it returns the flash object directly.

## Service defaults
In `config/environment.js`, you can override service defaults in the `flashMessageDefaults` object:

```javascript
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

See the [options](#custom-messages-api) section for information about flash message specific options.

- `type?: string`

  Default: `info`

  When adding a custom message with `add`, if no `type` is specified, this default is used.

- `types?: array`

  Default: `[ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ]`

  This option lets you specify exactly what types you need, which means in the above example, you can do `this.flashMessages.{alpaca,notice,foobar}`.

- `preventDuplicates?: boolean`

  Default: `false`

  If `true`, only 1 instance of a flash message (based on its `message`) can be added at a time. For example, adding two flash messages with the message `"Great success!"` would only add the first instance into the queue, and the second is ignored.

## Displaying flash messages
Then, to display somewhere in your app, add this to your template:

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} />
{{/each}}
```

It also accepts your own template:

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} as |component flash|>
    <h6>{{component.flashType}}</h6>
    <p>{{flash.message}}</p>
    {{#if component.showProgressBar}}
      <div class="alert-progress">
        <div class="alert-progressBar" style="{{component.progressDuration}}"></div>
      </div>
    {{/if}}
  </FlashMessage>
{{/each}}
```

### Custom `close` action
The `close` action is always passed to the component whether it is used or not. It can be used to implement your own close button, such as an `x` in the top-right corner.

When using a custom `close` action, you will want to set `destroyOnClick=false` to override the default (`destroyOnClick=true`). You could do this globally in `flashMessageDefaults`.

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} as |component flash close|>
    {{flash.message}}
    <span role="button" {{on "click" (action close)}}>x</span>
  </FlashMessage>
{{/each}}
```

### Styling with Foundation or Bootstrap
By default, flash messages will have Bootstrap style class names. If you want to use Foundation, simply specify the `messageStyle` on the component:

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} @messageStyle='foundation' />
{{/each}}
```

### Styling with user-specified message type class prefix
If you don't wish to use the class names associated with Bootstrap / Foundation, specify the `messageStylePrefix` on the component. This will override the class name prefixes with your own. For example, `messageStylePrefix='special-alert-'` would create flash messages with the class `special-alert-succcess`

```handlebars
{{#each flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} @messageStylePrefix='special-alert-' />
{{/each}}
```

### Sort messages by priority
To display messages sorted by priority, add this to your template:

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  <FlashMessage @flash={{flash}} />
{{/each}}
```

### Rounded corners (Foundation)
To add `radius` or `round` type corners in Foundation:

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  <FlashMessage @flash={{flash}} @messageStyle='foundation' class='radius' />
{{/each}}
```

```handlebars
{{#each flashMessages.arrangedQueue as |flash|}}
  <FlashMessage @flash={{flash}} @messageStyle='foundation' class='round' />
{{/each}}
```

### Custom flash message component
If the provided component isn't to your liking, you can easily create your own. All you need to do is pass in the `flash` object to that component:

```handlebars
{{#each flashMessages.queue as |flash|}}
  <CustomComponent @flash={{flash}} />
{{/each}}
```

## Acceptance / Integration tests
When you install the addon, it should automatically generate a helper located at `tests/helpers/flash-message.js`. You can do this manually as well:

```shell
$ ember generate ember-cli-flash
```

This also adds the helper to `tests/test-helper.js`. You won't actually need to import this into your tests, but it's good to know what the blueprint does. Basically, the helper overrides a method used to initialise the flash-message's class, so that it behaves intuitively in a testing environment.

Some example tests below, based on qunit.

An example acceptance test:

```javascript
// tests/acceptance/foo-page-test.js

import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'
import { click, visit } from '@ember/test-helpers'

module('Application | Component | foo-page', function (hooks) {
  setupApplicationTest(hooks)

  test('flash message is rendered', async function(assert) {
    assert.expect(1);

    await visit('/');

    await click('.button-that-opens-alert')

    assert.dom('.alert.alert-success').exists({ count: 1 });
  });
});
```

An example integration test:

```javascript
// tests/integration/components/x-foo-test.js

import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import { hbs } from 'ember-cli-htmlbars'

module('Integration | Component | x-foo', function (hooks) {
  setupRenderingTest(hooks)

  hooks.beforeEach(function() {
    // We have to register any types we expect to use in this component
    const typesUsed = ['info', 'warning', 'success'];
    this.owner.lookup('service:flash-messages').registerTypes(typesUsed);
  })

  test('it renders', function(assert) {
    await render(hbs`<XFoo/>`)
    ...
  })
});
```

## Unit testing
For unit tests that require the `flashMessages` service, you'll need to do a small bit of setup:

```js
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Container | Route | foo', function (hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    // We have to register any types we expect to use in this component
    const typesUsed = ['info', 'warning', 'success'];
    this.owner.lookup('service:flash-messages').registerTypes(typesUsed);
  })

  test('it does the thing it should do', function(assert) {
    const subject = this.owner.lookup('route:foo')
    ...
  })
});
```

## Styling
This addon is minimal and does not currently ship with a stylesheet. You can style flash messages by targeting the appropriate alert classes in your CSS.

## License
[MIT](LICENSE.md)

## Contributors

We're grateful to these wonderful contributors who've contributed to `ember-cli-flash`:

[//]: contributor-faces
<a href="https://github.com/poteto"><img src="https://avatars0.githubusercontent.com/u/1390709?v=4" title="poteto" width="80" height="80"></a>
<a href="https://github.com/Dhaulagiri"><img src="https://avatars1.githubusercontent.com/u/1672302?v=4" title="Dhaulagiri" width="80" height="80"></a>
<a href="https://github.com/sbatson5"><img src="https://avatars3.githubusercontent.com/u/881981?v=4" title="sbatson5" width="80" height="80"></a>
<a href="https://github.com/johno"><img src="https://avatars2.githubusercontent.com/u/1424573?v=4" title="johno" width="80" height="80"></a>
<a href="https://github.com/rwjblue"><img src="https://avatars0.githubusercontent.com/u/12637?v=4" title="rwjblue" width="80" height="80"></a>
<a href="https://github.com/mike-north"><img src="https://avatars1.githubusercontent.com/u/558005?v=4" title="mike-north" width="80" height="80"></a>
<a href="https://github.com/jrjohnson"><img src="https://avatars2.githubusercontent.com/u/349624?v=4" title="jrjohnson" width="80" height="80"></a>
<a href="https://github.com/martndemus"><img src="https://avatars2.githubusercontent.com/u/903637?v=4" title="martndemus" width="80" height="80"></a>
<a href="https://github.com/bgentry"><img src="https://avatars2.githubusercontent.com/u/114033?v=4" title="bgentry" width="80" height="80"></a>
<a href="https://github.com/cowboyd"><img src="https://avatars2.githubusercontent.com/u/4205?v=4" title="cowboyd" width="80" height="80"></a>
<a href="https://github.com/kmiyashiro"><img src="https://avatars1.githubusercontent.com/u/71852?v=4" title="kmiyashiro" width="80" height="80"></a>
<a href="https://github.com/st-h"><img src="https://avatars1.githubusercontent.com/u/5768353?v=4" title="st-h" width="80" height="80"></a>
<a href="https://github.com/abhilashlr"><img src="https://avatars0.githubusercontent.com/u/5667722?v=4" title="abhilashlr" width="80" height="80"></a>
<a href="https://github.com/jrowlingson"><img src="https://avatars0.githubusercontent.com/u/3051781?v=4" title="jrowlingson" width="80" height="80"></a>
<a href="https://github.com/charlatan154"><img src="https://avatars2.githubusercontent.com/u/1842448?v=4" title="charlatan154" width="80" height="80"></a>
<a href="https://github.com/lxcodes"><img src="https://avatars3.githubusercontent.com/u/62131?v=4" title="lxcodes" width="80" height="80"></a>
<a href="https://github.com/blimmer"><img src="https://avatars1.githubusercontent.com/u/630449?v=4" title="blimmer" width="80" height="80"></a>
<a href="https://github.com/benmurden"><img src="https://avatars3.githubusercontent.com/u/213062?v=4" title="benmurden" width="80" height="80"></a>
<a href="https://github.com/bsclifton"><img src="https://avatars3.githubusercontent.com/u/4733304?v=4" title="bsclifton" width="80" height="80"></a>
<a href="https://github.com/caseywatts"><img src="https://avatars1.githubusercontent.com/u/273653?v=4" title="caseywatts" width="80" height="80"></a>
<a href="https://github.com/cythrawll"><img src="https://avatars2.githubusercontent.com/u/99422?v=4" title="cythrawll" width="80" height="80"></a>
<a href="https://github.com/makepanic"><img src="https://avatars3.githubusercontent.com/u/1205444?v=4" title="makepanic" width="80" height="80"></a>
<a href="https://github.com/cigoe"><img src="https://avatars3.githubusercontent.com/u/518239?v=4" title="cigoe" width="80" height="80"></a>
<a href="https://github.com/cmcclure"><img src="https://avatars2.githubusercontent.com/u/4295108?v=4" title="cmcclure" width="80" height="80"></a>
<a href="https://github.com/dcyriller"><img src="https://avatars2.githubusercontent.com/u/6677373?v=4" title="dcyriller" width="80" height="80"></a>
<a href="https://github.com/dfreeman"><img src="https://avatars2.githubusercontent.com/u/108688?v=4" title="dfreeman" width="80" height="80"></a>
<a href="https://github.com/Darshan-Chauhan"><img src="https://avatars2.githubusercontent.com/u/18572215?v=4" title="Darshan-Chauhan" width="80" height="80"></a>
<a href="https://github.com/dustinspecker"><img src="https://avatars3.githubusercontent.com/u/2449282?v=4" title="dustinspecker" width="80" height="80"></a>

[//]: contributor-faces
