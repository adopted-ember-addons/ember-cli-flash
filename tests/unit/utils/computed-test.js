import Ember from 'ember';
import computed from 'ember-cli-flash/utils/computed';
import { module, test } from 'qunit';

const { get } = Ember;

module('Unit | Utility | computed');

test('#add adds `dependentKeys` that are numbers together', function(assert) {
  const expectedResult = 60;
  const Person = Ember.Object.extend({
    scores: computed.add('first', 'second', 'third', 'fourth')
  });
  const person = Person.create({
    first: 10,
    second: 20,
    third: 30,
    fourth: 'foo'
  });
  const result = get(person, 'scores');
  assert.equal(result, expectedResult, 'it adds `dependentKeys` that are numbers together');
});

test('#guidFor generates a guid for a `dependentKey`', function(assert) {
  const Flash = Ember.Object.extend({
    _guid: computed.guidFor('message')
  });
  const flash = Flash.create({
    message: 'I like pie'
  });
  const result = get(flash, '_guid');
  assert.ok(result, 'it generated a guid for `dependentKey`');
});

test('#guidFor generates the same guid for a message', function(assert) {
  const Flash = Ember.Object.extend({
    _guid: computed.guidFor('message')
  });
  const flash = Flash.create({
    message: new Ember.Handlebars.SafeString('I like pie')
  });
  const secondFlash = Flash.create({
    message: new Ember.Handlebars.SafeString('I like pie')
  });
  const result = get(flash, '_guid');
  const secondResult = get(secondFlash, '_guid');
  assert.equal(result, secondResult, 'it generated the same guid for messages that compute to the same string');
});
