import objectWithout from 'ember-cli-flash/utils/object-without';
import { module, test } from 'qunit';

module('Unit | Utility | object without');

test('it returns an object without the specified keys', function(assert) {
  const employee = {
    name: 'Milton Waddams',
    stapler: 'Red',
    deskLocation: 'basement'
  };

  const expectedResult = {
    name: 'Milton Waddams',
    deskLocation: 'basement'
  };

  const result = objectWithout(employee, ['stapler']);

  assert.deepEqual(result, expectedResult, 'it returns an object without the specified keys');
});
