# ember-cli-flash
[![Circle CI](https://circleci.com/gh/poteto/ember-cli-flash.svg?style=svg)](https://circleci.com/gh/poteto/ember-cli-flash)

This `ember-cli` addon adds a simple flash message service to your app. It's injected into all controllers and routes by default.

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
Usage is very simple. From within a `Controller` or `Route`:

```javascript
actions: {
  successAction() {
    Ember.get(this, 'flashes').success('Success!', 2000);
  },

  warningAction() {
    Ember.get(this, 'flashes').warning('This is a warning message'); // timeout is optional
  },

  infoAction() {
    Ember.get(this, 'flashes').info('You just did something...', 500);
  },

  dangerAction() {
    Ember.get(this, 'flashes').danger('So danger');
  },

  customAction() {
    Ember.get(this, 'flashes').addMessage('This is a flash with a custom type', 'myCustomType', 3000)
  },

  clearMessages() {
    Ember.get(this, 'flashes').clearMessages(); // clears all visible flash messages 
  }
}
```

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

## Styling
You can style flash messages by targetting `.flashMessage` or `.alert` in your CSS. You can specifically target flash messages of different type by adding `.alert-{type}` to your CSS, where `{type}` is `success`, `info`, etc. 

## Contributing
Please read the [Contributing guidelines](CONTRIBUTING.md) for information on how to contribute.

## Backlog

- [ ] Bundled themes for flash messages
- [ ] Prevent duplicate flash messages
- [ ] Progress bar showing how much time is left
- [ ] Sort options 

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
