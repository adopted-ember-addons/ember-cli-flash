import { htmlSafe } from '@ember/template';
import EmberObject from '@ember/object';
import { guidFor } from 'ember-cli-flash/utils/computed';
import { module, test } from 'qunit';

module('Unit | Utility | computed', function () {
  test('#guidFor generates a guid for a `dependentKey`', function (assert) {
    const Flash = EmberObject.extend({
      _guid: guidFor('message'),
    });
    const flash = Flash.create({
      message: 'I like pie',
    });
    const result = flash._guid;
    assert.ok(result, 'it generated a guid for `dependentKey`');
  });

  test('#guidFor generates the same guid for a message', function (assert) {
    const Flash = EmberObject.extend({
      _guid: guidFor('message'),
    });
    const flash = Flash.create({
      message: htmlSafe('I like pie'),
    });
    const secondFlash = Flash.create({
      message: htmlSafe('I like pie'),
    });
    const result = flash._guid;
    const secondResult = secondFlash._guid;
    assert.strictEqual(
      result,
      secondResult,
      'it generated the same guid for messages that compute to the same string'
    );
  });
});
