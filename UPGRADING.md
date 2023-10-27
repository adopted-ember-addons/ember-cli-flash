# Upgrading ember-cli-flash

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
-import FlashObject from 'ember-cli-flash/flash/object';
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
