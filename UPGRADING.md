# Upgrading ember-cli-flash

## Upgrading to v5

### Test helpers

In previous versions an install-time blueprint would add an import to your `tests/test-helper.js` file.

This was used to disable the timeout functionality where a flash message is removed after a delay. For most apps this is a sensible default.

Apps in which the blueprint ran will have the following import in their `tests/test-helper.js`:

```js
// tests/test-helper.js
import './helpers/flash-message';
```

Take note of whether this import is present in your app's `tests/test-helper.js`.

#### Import was present

You may remove the helper import. Flash messages should behave as they did before in your test runs.

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

#### Import was not present

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
