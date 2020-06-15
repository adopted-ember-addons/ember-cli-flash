# Service defaults

In `config/environment.js`, you can override service defaults in the `flashMessageDefaults` object:

{{#docs-snippet name="service-defaults.js"}}
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
{{/docs-snippet}}

See the {{docs-link 'options' 'docs.usage.custom-messages'}} section for information about flash message specific options.

- `type?: string`

  Default: `info`

  When adding a custom message with `add`, if no `type` is specified, this default is used.

- `types?: array`

  Default: `[ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ]`

  This option lets you specify exactly what types you need, which means in the above example, you can do `Ember.get('flashMessages').{alpaca,notice,foobar}`.

- `preventDuplicates?: boolean`

  Default: `false`

  If `true`, only 1 instance of a flash message (based on its `message`) can be added at a time. For example, adding two flash messages with the message `"Great success!"` would only add the first instance into the queue, and the second is ignored.
