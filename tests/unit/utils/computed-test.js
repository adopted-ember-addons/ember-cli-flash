import { htmlSafe } from '@ember/template';
import EmberObject from '@ember/object';
import {add, guidFor } from 'ember-cli-flash/utils/computed';
import { module, test } from 'qunit';

module('Unit | Utility | computed', function() {
  test('#add adds `dependentKeys` that are numbers together', function(assert) {
    const expectedResult = 60;
    const Person = EmberObject.extend({
      scores: add('first', 'second', 'third', 'fourth')
    });
    const person = Person.create({
      first: 10,
      second: 20,
      third: 30,
      fourth: 'foo'
    });
    const result = person.scores;
    assert.equal(result, expectedResult, 'it adds `dependentKeys` that are numbers together');
  });

  test('#guidFor generates a guid for a `dependentKey`', function(assert) {
    const Flash = EmberObject.extend({
      _guid: guidFor('message')
    });
    const flash = Flash.create({
      message: 'I like pie'
    });
    const result = flash._guid;
    assert.ok(result, 'it generated a guid for `dependentKey`');
  });

  test('#guidFor generates the same guid for a message', function(assert) {
    const Flash = EmberObject.extend({
      _guid: guidFor('message')
    });
    const flash = Flash.create({
      message: htmlSafe('I like pie')
    });
    const secondFlash = Flash.create({
      message: htmlSafe('I like pie')
    });
    const result = flash._guid;
    const secondResult = secondFlash._guid;
    assert.equal(result, secondResult, 'it generated the same guid for messages that compute to the same string');
  });
});
