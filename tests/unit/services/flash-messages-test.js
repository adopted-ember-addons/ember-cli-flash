import { run } from '@ember/runloop';
import { typeOf } from '@ember/utils';
import { set, get } from '@ember/object';
import { classify } from '@ember/string';
import { A as emberArray } from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from '../../../config/environment';
import EmberError from '@ember/error';

let service;
let SANDBOX = {};

module('FlashMessagesService', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    service = this.owner.lookup('service:flash-messages');
  });

  hooks.afterEach(function() {
    run(() => {
      get(service, 'queue').clear();
      service.destroy();
    });

    service = null;
    SANDBOX = {};
  });

  test('#queue returns an array of flash messages', function(assert) {
    assert.expect(2);

    service.success('success 1');
    service.success('success 2');
    service.success('success 3');

    assert.equal(typeOf(get(service, 'queue')), 'array', 'it returns an array');
    assert.equal(get(service, 'queue.length'), 3, 'it returns the correct number of flash messages');
  });

  test('#arrangedQueue returns an array of flash messages, sorted by priority', function(assert) {
    assert.expect(4);

    service.success('success 1', { priority: 100 });
    service.success('success 2', { priority: 200 });
    service.success('success 3', { priority: 300 });

    assert.equal(typeOf(get(service, 'queue')), 'array', 'it returns an array');
    assert.equal(get(service, 'queue.length'), 3, 'it returns the correct number of flash messages');
    assert.equal(get(service, 'arrangedQueue.0.priority'), 300, 'it returns flash messages in the right order');
    assert.equal(get(service, 'arrangedQueue.2.priority'), 100, 'it returns flash messages in the right order');
  });

  test('#arrangedQueue is read only', function(assert) {
    assert.expect(2);

    assert.throws(() => {
      service.set('arrangedQueue', [ 'foo' ]);
    });

    assert.equal(get(service, 'arrangedQueue.length'), 0, 'it did not set #arrangedQueue');
  });

  test('#add adds a custom message', function(assert) {
    assert.expect(4);

    service.add({
      message: 'test',
      type: 'test',
      timeout: 1,
      sticky: true,
      showProgress: true
    });

    assert.equal(get(service, 'queue.0.type'), 'test', 'it has the correct type');
    assert.equal(get(service, 'queue.0.timeout'), 1, 'it has the correct timeout');
    assert.equal(get(service, 'queue.0.sticky'), true, 'it has the correct sticky');
    assert.equal(get(service, 'queue.0.showProgress'), true, 'it has the correct show progress');
  });

  test('#add adds a custom message with default type', function(assert) {
    assert.expect(1);

    SANDBOX.flash = service.add({
      message: 'test'
    });

    assert.equal(get(service, 'queue.0.type'), 'info', 'it has the correct type');
  });

  test('#clearMessages clears the queue', function(assert) {
    assert.expect(2);

    service.success('foo');
    service.success('bar');
    service.success('baz');
    run(() => service.clearMessages());

    assert.equal(typeOf(get(service, 'queue')), 'array', 'it returns an array');
    assert.equal(get(service, 'queue.length'), 0, 'it clears the array');
  });

  test('#registerTypes registers new types', function(assert) {
    assert.expect(2);

    service.registerTypes(['foo', 'bar']);
    SANDBOX.type1 = service.foo;
    SANDBOX.type2 = service.bar;

    assert.equal(typeOf(SANDBOX.type1), 'function', 'it creates a new method on the service');
    assert.equal(typeOf(SANDBOX.type2), 'function', 'it creates a new method on the service');
  });

  test('it registers default types on init', function(assert) {
    const defaultTypes = [ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ];
    const expectLength = defaultTypes.length * 2;

    assert.expect(expectLength);

    defaultTypes.forEach((type) => {
      const method = service[type];

      assert.ok(method);
      assert.equal(typeOf(method), 'function');
    });
  });

  test('it adds specific options via add()', function(assert) {
    assert.expect(1);

    service.add({
      message: "here's an option you may or may not know",
      appOption: 'ohai'
    });

    assert.equal(get(service, 'queue.0.appOption'), 'ohai');
  });

  test('it adds specific options via specific message type', function(assert) {
    assert.expect(1);

    service.info('you can pass app options this way too', {
      appOption: 'we meet again app-option'
    });

    assert.equal(get(service, 'queue.0.appOption'), 'we meet again app-option');
  });

  test('it sets the correct defaults for service properties', function(assert) {
    const { flashMessageDefaults } = config;
    const configOptions = Object.keys(flashMessageDefaults);
    const expectLength = configOptions.length;

    assert.expect(expectLength);

    for (let option in flashMessageDefaults) {
      const classifiedKey = `default${classify(option)}`;
      const defaultValue = service[classifiedKey];
      const configValue = flashMessageDefaults[option];

      assert.equal(defaultValue, configValue);
    }
  });

  test('when preventDuplicates is `false` setting a message is not required', function(assert) {
    set(service, 'defaultPreventDuplicates', false);

    service.add({
      customProperty: 'ohai'
    });

    assert.equal(get(service, 'queue.firstObject.customProperty'), 'ohai');
  });

  test('when preventDuplicates is `true`, setting a message is required', function(assert) {
    set(service, 'defaultPreventDuplicates', true);

    assert.throws(() => {
        service.add({ });
      },
      new EmberError('Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.'),
      'Error is thrown'
    );
  });

  test('when preventDuplicates is `false` but flashInstance preventDuplicates is `true` setting a message is not required', function(assert) {
    set(service, 'defaultPreventDuplicates', false);

    assert.throws(() => {
        service.add({ preventDuplicates: true });
      },
      new EmberError('Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.'),
      'Error is thrown'
    );
  });

  test('it adds duplicate messages to the queue if preventDuplicates is `false`', function(assert) {
    set(service, 'defaultPreventDuplicates', false);
    const expectedResult = emberArray([ 'foo', 'foo', 'bar' ]);
    expectedResult.forEach((message) => service.success(message));
    const result = get(service, 'queue').mapBy('message');

    assert.deepEqual(result, expectedResult, 'it adds duplicate messages to the queue');
    assert.equal(get(service, 'queue').length, 3, 'it adds duplicate messages to the queue');
  });

  test('it does not add duplicate messages to the queue if preventDuplicates is `true`', function(assert) {
    set(service, 'defaultPreventDuplicates', true);
    const messages = emberArray([ 'foo', 'foo', 'bar' ]);
    const expectedResult = messages.uniq();
    messages.forEach((message) => service.success(message));
    const result = get(service, 'queue').mapBy('message');

    assert.deepEqual(result, expectedResult, 'it does not add duplicate messages to the queue');
    assert.equal(get(service, 'queue').length, 2, 'it does not add duplicate messages to the queue');
  });

  test('it does not add duplicate messages to the queue if flashInstance preventDuplicates is `true`', function(assert) {
    set(service, 'defaultPreventDuplicates', false);
    const messages = emberArray([ 'foo', 'foo', 'bar' ]);
    const expectedResult = messages.uniq();
    messages.forEach((message) => service.success(message, {preventDuplicates: true}));
    const result = get(service, 'queue').mapBy('message');

    assert.deepEqual(result, expectedResult, 'it does not add duplicate messages to the queue');
    assert.equal(get(service, 'queue').length, 2, 'it does not add duplicate messages to the queue');
  });

  test('flashInstance preventDuplicates prefers instance preventDuplicates over global', function(assert) {
    set(service, 'defaultPreventDuplicates', true);
    const messages = emberArray([ 'foo', 'foo', 'bar' ]);
    const expectedResult = [ 'foo', 'foo', 'bar' ];
    messages.forEach((message) => service.success(message, {preventDuplicates: false}));
    const result = get(service, 'queue').mapBy('message');

    assert.deepEqual(result, expectedResult, 'it adds duplicate messages to the queue');
    assert.equal(get(service, 'queue').length, 3, 'it adds duplicate messages to the queue');
  });

  test('it does use the global preventDuplicates if the instance option isn\'t set', function(assert) {
    set(service, 'defaultPreventDuplicates', false);
    service.success('foo');
    service.success('foo');
    service.success('bar', {preventDuplicates: true});
    service.success('bar', {preventDuplicates: true});
    service.success('foo');
    service.success('baz', {preventDuplicates: true});

    const result = get(service, 'queue').mapBy('message');

    assert.deepEqual(result, ['foo', 'foo', 'bar', 'foo', 'baz'], 'it adds duplicated messages if preventDuplicates isn\'t set');
    assert.equal(get(service, 'queue').length, 5, 'it handles duplicates where preventDuplicates is false');
  });

  test('it supports chaining', function(assert) {
    service
      .registerTypes(['meow'])
      .clearMessages()
      .add({ message: 'foo' })
      .meow('bar');

    assert.equal(get(service, 'queue.firstObject.message'), 'foo', 'should support chaining');
    assert.equal(get(service, 'queue.lastObject.message'), 'bar', 'should support chaining');
  });

  test('it returns flash object when fetched through `getFlashObject`', function(assert) {
    const { flashMessageDefaults } = config;
    const flash = service
      .clearMessages()
      .add({ message: 'foo' })
      .getFlashObject();

    assert.equal(get(flash, 'message'), 'foo', 'it returns flash object with correct message');
    assert.equal(get(flash, 'timeout'), flashMessageDefaults.timeout, 'it returns an object with defaults');
  });

  test('it supports public API methods for `peekLast` and `peekFirst`', function(assert) {
    service.clearMessages();

    assert.equal(typeOf(service.peekLast()), 'undefined', 'returns undefined when queue is empty');
    assert.equal(typeOf(service.peekFirst()), 'undefined', 'returns undefined when queue is empty');

    service.add({ message: 'foo' }).add({ message: 'bar' });

    assert.equal(service.peekFirst().message, 'foo', 'returns first object from queue');
    assert.equal(service.peekLast().message, 'bar', 'returns last object from queue');
  });
});
