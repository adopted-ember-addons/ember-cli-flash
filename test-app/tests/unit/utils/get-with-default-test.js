import getWithDefault from 'ember-cli-flash/utils/get-with-default';
import { module, test } from 'qunit';

module('Unit | Utility | get-with-default', function () {
  test('it returns the default value when the target value is undefined', function (assert) {
    let obj = {
      testKey: undefined,
    };

    let defaultValue = 'defaultValue';
    let result = getWithDefault(obj, 'testKey', defaultValue);

    assert.strictEqual(result, defaultValue);
  });

  test('it returns the target value when available', function (assert) {
    assert.expect(7);

    let obj = {
      truthy: true,
      falsy: false,
      truthyNumber: 1,
      falsyNumber: 0,
      string: 'test',
      emptyString: '',
      null: null,
    };

    let defaultValue = 'defaultValue';

    for (let [key, value] of Object.entries(obj)) {
      let result = getWithDefault(obj, key, defaultValue);

      assert.strictEqual(result, value);
    }
  });
});
