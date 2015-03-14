# ember-cli-flash
[![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![Build Status](https://travis-ci.org/poteto/ember-cli-flash.svg)](https://travis-ci.org/poteto/ember-cli-flash) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-flash.svg)](http://emberobserver.com/addons/ember-cli-flash) [![Circle CI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=svg)](https://circleci.com/gh/poteto/ember-cli-flash)

[Statistics for `ember-cli-flash`](http://www.npm-stats.com/~packages/ember-cli-flash)

This `ember-cli` addon adds a simple flash message service to your app. It's injected into all `Controllers`, `Routes`, `Views` and `Components` by default. It can also be lazily injected.

## Installation
You can install either with `npm`:

```shell
npm install ember-cli-flash --save
```

or `ember install:addon`:

```shell
ember install:addon ember-cli-flash
```

## Usage
Usage is very simple. From within a `Controller`, `Route`, `View` or `Component`:

### Convenience methods (Bootstrap / Foundation alerts)
You can quickly add flash messages using:

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
// the flash message component will have 'alert alert-success' classes
// the flash message component will have 'alert-box success' classes
Ember.get(this, 'flashes').success('Success!');
```

### Custom messages
If the convenience methods don't fit your needs, you can add custom messages with `add`:

```javascript
Ember.get(this, 'flashes').add({
  message: 'Custom message'
});
```

### Options
You can also pass in options:

```javascript
Ember.get(this, 'flashes').add({
  message  : 'I like alpacas',
  type     : 'alpaca'
  timeout  : 500,
  priority : 200,
  sticky   : true
});

Ember.get(this, 'flashes').success('This is amazing', {
  timeout  : 100,
  priority : 100,
  sticky   : false
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

### Registering new types
If you find yourself creating many custom messages with the same custom type, you can register it with the service and use that method instead.

```javascript
Ember.get(this, 'flashes').registerType('birthday');
Ember.get(this, 'flashes').birthday("Hey shawty, it's your birthday");
```

### Clearing all messages on screen
It's best practise to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

```javascript
Ember.get(this, 'flashes').clearMessages(); // clears all visible flash messages
```

### Lazy service injection
If you're using Ember `1.10.0` or higher, you can also inject the service manually on any `Ember.Object` registered in the container:

```javascript
flashes: Ember.inject.service('flash-messages')
```

### Promises
You can also take advantage of Promises, and their `.then` and `.catch` methods. To add a flash message after saving a model (or when it fails):

```javascript
actions: {
  saveFoo() {
    var flash = Ember.get(this, 'flashes');

    Ember.get(this, 'model').save()
    .then(function(res) {
      flash.success('Successfully saved!');
    })
    .catch(function(err) {
      flash.danger('Something went wrong!');
    });
  }
}
```

## Displaying flash messages
Then, to display somewhere in your app, add this to your template:

```handlebars
{{#each flashes.queue as |flash|}}
  {{flash-message flash=flash}}
{{/each}}
```

It also accepts your own template:

```handlebars
{{#each flashes.queue as |flash|}}
  {{#flash-message flash=flash}}
    <h6>{{flashType}}</h6>
    <p>{{flash.message}}</p>
  {{/flash-message}}
{{/each}}
```

### Styling with Foundation or Boostrap
By default, flash messages will have Bootstrap style class names. If you want to use Foundation, simply specify the `messageStyle` on the component:

```handlebars
{{#each flashes.queue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation'}}
{{/each}}
```

### Sort messages by priority
To display messages sorted by priority, add this to your template:

```handlebars
{{#each flashes.arrangedQueue as |flash|}}
  {{flash-message flash=flash}}
{{/each}}
```

### Rounded corners (Foundation)
To add `radius` or `round` type corners in Foundation:

```handlebars
{{#each flashes.arrangedQueue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation' class='radius'}}
{{/each}}
```

```handlebars
{{#each flashes.arrangedQueue as |flash|}}
  {{flash-message flash=flash messageStyle='foundation' class='round'}}
{{/each}}
```

## Styling
You can style flash messages by targetting `.flashMessage` or the appropriate alert class (Foundation or Bootstrap) in your CSS.

## Contributing
Please read the [Contributing guidelines](CONTRIBUTING.md) for information on how to contribute.

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
