import objectCompact from 'ember-cli-flash/utils/object-compact';
import { module, test } from 'qunit';

module('Unit | Utility | object compact');

test('it returns an object with all `null` and `undefined` elements removed', function(assert) {
  const rawData = {
    firstName: 'Michael',
    lastName: 'Bolton',
    company: undefined,
    age: null,
    favoriteDrink: ''
  };
  const expectedResult = {
    firstName: 'Michael',
    lastName: 'Bolton'
  };

  const result = objectCompact(rawData);
  assert.deepEqual(result, expectedResult, 'it should not contain `null` or `undefined` elements');
});
