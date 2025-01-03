import { module, test } from 'qunit';
import { objectOnly } from 'ember-cli-flash/utils';

module('Unit | Utility | object only', function () {
  test('it returns an object with only the specified keys', function (assert) {
    const employee = {
      name: 'Milton Waddams',
      stapler: 'Red',
      deskLocation: 'basement',
    };

    const expectedResult = {
      name: 'Milton Waddams',
      deskLocation: 'basement',
    };

    const result = objectOnly(employee, ['name', 'deskLocation']);

    assert.deepEqual(
      result,
      expectedResult,
      'it returns an object with only the specified keys',
    );
  });
});
