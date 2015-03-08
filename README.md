# ember-cli-flash
[![npm version](https://badge.fury.io/js/ember-cli-flash.svg)](http://badge.fury.io/js/ember-cli-flash) [![Circle CI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=svg)](https://circleci.com/gh/poteto/ember-cli-flash) [![Build Status](https://travis-ci.org/poteto/ember-cli-flash.svg)](https://travis-ci.org/poteto/ember-cli-flash) [![Coverage Status](https://coveralls.io/repos/poteto/ember-cli-flash/badge.svg)](https://coveralls.io/r/poteto/ember-cli-flash)

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
#### Convenience methods (Bootstrap style)
You can quickly add flash messages using `.success`, `.warning`, `.info`, and `.danger`. For example:

```javascript
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
  priority : 500
});
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
{{#each flash in flashes.queue}}
  {{flash-message flash=flash}}
{{/each}}
```

It also accepts your own template:

```handlebars
{{#each flash in flashes.queue}}
  {{#flash-message flash=flash}}
    <h6>{{flash.flashType}}</h6>
    <p>{{flash.message}}</p>
  {{/flash-message}}
{{/each}}
```

### Sort messages by priority
To display messages sorted by priority, add this to your template:

```handlebars
{{#each flash in flashes.arrangedQueue}}
  {{flash-message flash=flash}}
{{/each}}
```

## Styling
You can style flash messages by targetting `.flashMessage` or `.alert` in your CSS. You can specifically target flash messages of different type by adding `.alert-{type}` to your CSS, where `{type}` is `success`, `info`, etc.

## Contributing
Please read the [Contributing guidelines](CONTRIBUTING.md) for information on how to contribute.

## Backlog

- [x] Sort options by priority
- [ ] Bundled themes for flash messages
- [ ] Prevent duplicate flash messages
- [ ] Progress bar showing how much time is left

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
