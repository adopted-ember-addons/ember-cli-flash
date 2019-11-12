# Convenience methods (Bootstrap / Foundation alerts)
You can quickly add flash messages using these methods from the service:

### Bootstrap
- `.success`
- `.warning`
- `.info`
- `.danger`

### Foundation
- `.success`
- `.warning`
- `.info`
- `.alert`
- `.secondary`

These will add the appropriate classes to the flash message component for styling in Bootstrap or Foundation. For example:

{{#docs-snippet name='usage-2.js'}}
  // Bootstrap: the flash message component will have 'alert alert-success' classes
  // Foundation: the flash message component will have 'alert-box success' classes
  import { get } from '@ember/object';

  get(this, 'flashMessages').success('Success!');
{{/docs-snippet}}

You can take advantage of Promises, and their `.then` and `.catch` methods. To add a flash message after saving a model (or when it fails):

{{#docs-snippet name='usage-3.js'}}
  import { get } from '@ember/object';

  actions: {
    saveFoo() {
      const flashMessages = get(this, 'flashMessages');

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
{{/docs-snippet}}
