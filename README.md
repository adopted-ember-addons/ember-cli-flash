# ember-cli-flash
[![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![Build Status](https://travis-ci.org/poteto/ember-cli-flash.svg)](https://travis-ci.org/poteto/ember-cli-flash) [![Ember Observer Score](http://emberobserver.com/badges/ember-cli-flash.svg)](http://emberobserver.com/addons/ember-cli-flash) [![Circle CI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=svg)](https://circleci.com/gh/poteto/ember-cli-flash)

[Statistics for `ember-cli-flash`](http://www.npm-stats.com/~packages/ember-cli-flash)

This `ember-cli` addon adds a simple flash message service to your app. It's injected into all Controllers, Routes, Views and Components by default. It can also be lazily injected.

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

### API
#### Convenience methods (Bootstrap / Foundation alerts)
You can quickly add flash messages using:

##### Bootstrap
- `.success`
- `.warning`
- `.info`
- `.danger`

##### Foundation
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

You can also pass in options for `timeout` and `priority`. The best practise is to use priority values in multiples of `100` (`100` being the lowest priority):

```javascript
Ember.get(this, 'flashes').warning('Something went wrong', {
  priority : 1000
});

Ember.get(this, 'flashes').success('Successfully signed in', {
  timeout  : 500,
  priority : 200
});
```

The `warning` message will appear on top of the `success` message. Messages with the highest `priority` values will appear at the top of the queue.

#### Custom messages
If the convenience methods don't fit your needs, you can add custom messages:

```javascript
Ember.get(this, 'flashes').addMessage('You won!', {
  type    : 'congratulations',
  timeout : 3000
});

Ember.get(this, 'flashes').add({
  message  : 'Custom message'
  type     : 'customType',
  timeout  : 2000,
  priority : 500
});
```

#### Registering new types
If you find yourself creating many custom messages with the same custom type, you can register it with the service and use that method instead.

```javascript
Ember.get(this, 'flashes').registerType('birthday');
Ember.get(this, 'flashes').birthday("Hey shawty, it's your birthday");
```

#### Clearing all messages on screen
It's best practise to use flash messages sparingly, only when you need to notify the user of something. If you're sending too many messages, and need a way for your users to clear all messages from screen, you can use this method:

```javascript
Ember.get(this, 'flashes').clearMessages(); // clears all visible flash messages
```

### Lazy service injection
If you're using Ember `1.10.0` or higher, you can also inject the service manually:

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
