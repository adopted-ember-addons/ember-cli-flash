# Upgrading ember-cli-flash

## Upgrading to v5

### Test helpers

In previous versions an install-time blueprint would add an import to consuming apps' `tests/test-helper.js` file.

This was used to disable the timeout functionality where a flash message is removed after a delay. For most apps this is a sensible default.

Most apps with this addon installed will have the following import in their `tests/test-helper.js`:

```js
// tests/test-helper.js
import './helpers/flash-message';
```

Remove this import and replace it with the `disableTimeout` helper function. This helper function _should also be invoked_ within the same file.

```diff
// tests/test-helper.js
import Application from 'example-app/app';
import config from 'example-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
- import './helpers/flash-message';
+ import { disableTimeout } from 'ember-cli-flash/test-support';

+ disableTimeout();

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
```

An `enableTimeout` helper is also provided for fine-grained control at any time during test runs.
