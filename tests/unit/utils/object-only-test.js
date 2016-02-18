import objectOnly from 'ember-cli-flash/utils/object-only';
import { module, test } from 'qunit';

module('Unit | Utility | object only');

test('it returns an object with only the specified keys', function(assert) {
  const employee = {
    name: 'Milton Waddams',
    stapler: 'Red',
    deskLocation: 'basement'
  };

  const expectedResult = {
    name: 'Milton Waddams',
    deskLocation: 'basement'
  };

  const result = objectOnly(employee, ['name', 'deskLocation']);

  assert.deepEqual(result, expectedResult, 'it returns an object with only the specified keys');
});
