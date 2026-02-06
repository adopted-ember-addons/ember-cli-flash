# Upgrading ember-cli-flash

## Upgrading to v7

### Configuration via Environment is Removed

**This is a breaking change.** The addon no longer reads configuration from `config/environment.js`. You should now extend the service and override the `flashMessageDefaults` getter.

#### Before (v6)

```javascript
// config/environment.js
module.exports = function (environment) {
  const ENV = {
    // ...
    flashMessageDefaults: {
      timeout: 5000,
      extendedTimeout: 1000,
      priority: 200,
      sticky: false,
      showProgress: true,
      type: 'info',
      types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
      preventDuplicates: true,
    },
  };
  return ENV;
};
```

#### After (v7)

Create your own flash-messages service that extends the base service:

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class MyFlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 5000,
      extendedTimeout: 1000,
      priority: 200,
      showProgress: true,
      preventDuplicates: true,
    };
  }
}
```

### Default Options Reference

Here are all available default options you can configure:

| Option              | Type       | Default                                                          | Description                                                         |
| ------------------- | ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `timeout`           | `number`   | `3000`                                                           | Milliseconds before flash message is automatically removed          |
| `extendedTimeout`   | `number`   | `0`                                                              | Milliseconds to add 'exiting' class before removal (for animations) |
| `priority`          | `number`   | `100`                                                            | Higher priority messages appear first in `arrangedQueue`            |
| `sticky`            | `boolean`  | `false`                                                          | If `true`, message won't auto-dismiss (must be clicked)             |
| `showProgress`      | `boolean`  | `false`                                                          | Show a progress bar indicating time remaining                       |
| `type`              | `string`   | `'info'`                                                         | Default type when using `add()` without specifying type             |
| `types`             | `string[]` | `['success', 'info', 'warning', 'danger', 'alert', 'secondary']` | Available type methods on the service                               |
| `preventDuplicates` | `boolean`  | `false`                                                          | Prevent adding duplicate messages (based on message text)           |
| `destroyOnClick`    | `boolean`  | `true`                                                           | Whether clicking the message destroys it                            |

### Configuration Examples

#### Example 1: Basic Customization

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class FlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 5000,           // 5 seconds instead of 3
      showProgress: true,      // Always show progress bar
      preventDuplicates: true, // No duplicate messages
    };
  }
}
```

#### Example 2: Animated Flash Messages

For smooth animations when messages appear and disappear:

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class FlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 4000,
      extendedTimeout: 500, // Adds 'exiting' class 500ms before removal
    };
  }
}
```

Then animate with CSS:

```scss
.alert {
  opacity: 0;
  transform: translateX(100px);
  transition: all 500ms ease-out;

  &.active {
    opacity: 1;
    transform: translateX(0);

    &.exiting {
      opacity: 0;
      transform: translateX(100px);
    }
  }
}
```

#### Example 3: Custom Message Types

Register custom types for your application:

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class FlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      type: 'notice',
      types: ['notice', 'success', 'error', 'warning', 'system'],
    };
  }
}
```

Now you can use:

```typescript
this.flashMessages.notice('Check this out!');
this.flashMessages.system('Maintenance scheduled for tonight.');
this.flashMessages.error('Something went wrong!');
```

#### Example 4: Sticky Messages with Custom Close

For messages that require user interaction:

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class FlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      sticky: true,          // Don't auto-dismiss
      destroyOnClick: false, // Allow interaction without dismissing
    };
  }
}
```

Then in your template, use the `close` action:

```handlebars
{{#each this.flashMessages.queue as |flash|}}
  <FlashMessage @flash={{flash}} as |component flash close|>
    {{flash.message}}
    <button type="button" {{on "click" close}}>×</button>
  </FlashMessage>
{{/each}}
```

#### Example 5: High-Priority System Notifications

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

export default class FlashMessages extends FlashMessagesService {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      priority: 100, // Base priority
    };
  }

  // Custom method for high-priority system alerts
  systemAlert(message: string) {
    return this.add({
      message,
      type: 'danger',
      priority: 500,    // Higher than default
      sticky: true,
      showProgress: false,
    });
  }
}
```

### TypeScript Support with Generics

The service now supports TypeScript generics for custom fields:

```typescript
// app/services/flash-messages.ts
import { FlashMessagesService } from 'ember-cli-flash';

interface MyCustomFields {
  id: string;
  userId?: number;
  actionUrl?: string;
}

export default class MyFlashMessages extends FlashMessagesService<MyCustomFields> {
  get flashMessageDefaults() {
    return {
      ...super.flashMessageDefaults,
      timeout: 5000,
    };
  }
}
```

Then use custom fields when creating messages:

```typescript
this.flashMessages.success('Saved!', {
  id: 'save-notification',
  userId: 123,
  actionUrl: '/dashboard',
});

// Find and remove by custom field
const flash = this.flashMessages.findBy('id', 'save-notification');
this.flashMessages.removeBy('userId', 123);
```

### New Methods: `findBy` and `removeBy`

Two new methods have been added to the service for finding and removing flash messages by any field:

```typescript
// Find a flash message by any field
const message = this.flashMessages.findBy('id', 'notification-123');

// Remove a flash message by any field (returns boolean)
const wasRemoved = this.flashMessages.removeBy('id', 'notification-123');
```

### Component is Now a Glimmer Component

The `FlashMessage` component has been converted to a Glimmer component (`.gts` format). The public API remains the same, but if you were extending it, you'll need to update your code.

### Removed: `_destroyLater` Internal Method

The internal `_destroyLater` method has been removed. Use `destroyMessage()` instead.

---

## Upgrading to v6

### FlashObject is no longer an EmberObject

Most apps will be unaffected by this – unless they call `getFlashObject` to access flash messages.

Prior to v6 `FlashObject` extended [EmberObject](https://api.emberjs.com/ember/release/classes/emberobject/) and supported methods like `get`, `getProperties`, `set`, and `setProperties`.

It's now a native class, and property access can be done using regular dot syntax, eg `flash.get('message')` should be replaced with `flash.message`.

## Upgrading to v5

### Test helpers

In previous versions an install-time blueprint would add a test helper to `tests/helpers/flash-message.js` and import it in `tests/test-helper.js`.

This was used to disable the timeout functionality where a flash message is removed after a delay. For most test suites this is a sensible default.

Apps in which the blueprint ran will have a `tests/helpers/flash-message.js` file.

Take note of whether this helper is present in your app.

#### Helper was present

You should remove the test helper and its import.

```diff
// tests/helpers/flash-message.js
-import { FlashObject } from 'ember-cli-flash';
-
-FlashObject.reopen({ init() {} });
```

```diff
// tests/test-helper.js
import Application from 'example-app/app';
import config from 'example-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
- import './helpers/flash-message';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
```

Flash messages should behave as they did before in your test runs.

#### Helper was not present

Try running your app tests. If they pass then you have nothing more to do.

If your tests failed then they may have been relying on flash message timeouts being enabled.

You may import and invoke the `enableTimeout` helper within your `tests/test-helper.js`. This should restore the flash message timeout behaviour that your tests expect.

```diff
// tests/test-helper.js
import Application from 'example-app/app';
import config from 'example-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
+ import { enableTimeout } from 'ember-cli-flash/test-support';

+ enableTimeout();

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
```
