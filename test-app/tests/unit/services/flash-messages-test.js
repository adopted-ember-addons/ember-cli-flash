import { run } from '@ember/runloop';
import { typeOf } from '@ember/utils';
import { set } from '@ember/object';
import { classify } from '@ember/string';
import { A as emberArray } from '@ember/array';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from '../../../config/environment';

let SANDBOX = {};

module('FlashMessagesService', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:flash-messages');
  });

  hooks.afterEach(function () {
    run(() => {
      this.service.queue = [];
      this.service.destroy();
    });

    this.service = null;
    SANDBOX = {};
  });

  test('#queue returns an array of flash messages', function (assert) {
    assert.expect(2);

    this.service.success('success 1');
    this.service.success('success 2');
    this.service.success('success 3');

    assert.strictEqual(
      typeOf(this.service.queue),
      'array',
      'it returns an array'
    );
    assert.strictEqual(
      this.service.queue.length,
      3,
      'it returns the correct number of flash messages'
    );
  });

  test('#arrangedQueue returns an array of flash messages, sorted by priority', function (assert) {
    assert.expect(4);

    this.service.success('success 1', { priority: 100 });
    this.service.success('success 2', { priority: 200 });
    this.service.success('success 3', { priority: 300 });

    assert.strictEqual(
      typeOf(this.service.queue),
      'array',
      'it returns an array'
    );
    assert.strictEqual(
      this.service.queue.length,
      3,
      'it returns the correct number of flash messages'
    );
    assert.strictEqual(
      this.service.arrangedQueue[0].priority,
      300,
      'it returns flash messages in the right order'
    );
    assert.strictEqual(
      this.service.arrangedQueue[2].priority,
      100,
      'it returns flash messages in the right order'
    );
  });

  test('#arrangedQueue is read only', function (assert) {
    assert.expect(2);

    assert.throws(() => {
      this.service.set('arrangedQueue', ['foo']);
    });

    assert.strictEqual(
      this.service.arrangedQueue.length,
      0,
      'it did not set #arrangedQueue'
    );
  });

  test('#add adds a custom message', function (assert) {
    assert.expect(4);

    this.service.add({
      message: 'test',
      type: 'test',
      timeout: 1,
      sticky: true,
      showProgress: true,
    });

    assert.strictEqual(
      this.service.queue[0].type,
      'test',
      'it has the correct type'
    );
    assert.strictEqual(
      this.service.queue[0].timeout,
      1,
      'it has the correct timeout'
    );
    assert.true(this.service.queue[0].sticky, 'it has the correct sticky');
    assert.true(
      this.service.queue[0].showProgress,
      'it has the correct show progress'
    );
  });

  test('#add adds a custom message with default type', function (assert) {
    assert.expect(1);

    SANDBOX.flash = this.service.add({
      message: 'test',
    });

    assert.strictEqual(
      this.service.queue[0].type,
      'info',
      'it has the correct type'
    );
  });

  test('#clearMessages clears the queue', function (assert) {
    assert.expect(2);

    this.service.success('foo');
    this.service.success('bar');
    this.service.success('baz');
    run(() => this.service.clearMessages());

    assert.strictEqual(
      typeOf(this.service.queue),
      'array',
      'it returns an array'
    );
    assert.strictEqual(this.service.queue.length, 0, 'it clears the array');
  });

  test('#registerTypes registers new types', function (assert) {
    assert.expect(2);

    this.service.registerTypes(['foo', 'bar']);
    SANDBOX.type1 = this.service.foo;
    SANDBOX.type2 = this.service.bar;

    assert.strictEqual(
      typeOf(SANDBOX.type1),
      'function',
      'it creates a new method on the service'
    );
    assert.strictEqual(
      typeOf(SANDBOX.type2),
      'function',
      'it creates a new method on the service'
    );
  });

  test('it registers default types on init', function (assert) {
    const defaultTypes = [
      'success',
      'info',
      'warning',
      'danger',
      'alert',
      'secondary',
    ];
    const expectLength = defaultTypes.length * 2;

    assert.expect(expectLength);

    defaultTypes.forEach((type) => {
      const method = this.service[type];

      assert.ok(method);
      assert.strictEqual(typeOf(method), 'function');
    });
  });

  test('it adds specific options via add()', function (assert) {
    assert.expect(1);

    this.service.add({
      message: "here's an option you may or may not know",
      appOption: 'ohai',
    });

    assert.strictEqual(this.service.queue[0].appOption, 'ohai');
  });

  test('it adds specific options via specific message type', function (assert) {
    assert.expect(1);

    this.service.info('you can pass app options this way too', {
      appOption: 'we meet again app-option',
    });

    assert.strictEqual(
      this.service.queue[0].appOption,
      'we meet again app-option'
    );
  });

  test('it sets the correct defaults for service properties', function (assert) {
    const { flashMessageDefaults } = config;
    const configOptions = Object.keys(flashMessageDefaults);
    const expectLength = configOptions.length;

    assert.expect(expectLength);

    for (let option in flashMessageDefaults) {
      const classifiedKey = `default${classify(option)}`;
      const defaultValue = this.service[classifiedKey];
      const configValue = flashMessageDefaults[option];

      assert.strictEqual(defaultValue, configValue);
    }
  });

  test('when preventDuplicates is `false` setting a message is not required', function (assert) {
    set(this, 'service.defaultPreventDuplicates', false);

    this.service.add({
      customProperty: 'ohai',
    });

    assert.strictEqual(this.service.queue.at(0).customProperty, 'ohai');
  });

  test('when preventDuplicates is `true`, setting a message is required', function (assert) {
    set(this, 'service.defaultPreventDuplicates', true);

    assert.throws(
      () => {
        this.service.add({});
      },
      new Error(
        'Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.'
      ),
      'Error is thrown'
    );
  });

  test('when preventDuplicates is `false` but flashInstance preventDuplicates is `true` setting a message is not required', function (assert) {
    set(this, 'service.defaultPreventDuplicates', false);

    assert.throws(
      () => {
        this.service.add({ preventDuplicates: true });
      },
      new Error(
        'Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.'
      ),
      'Error is thrown'
    );
  });

  test('it adds duplicate messages to the queue if preventDuplicates is `false`', function (assert) {
    set(this, 'service.defaultPreventDuplicates', false);
    const expectedResult = emberArray(['foo', 'foo', 'bar']);
    expectedResult.forEach((message) => this.service.success(message));
    const result = this.service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it adds duplicate messages to the queue'
    );
    assert.strictEqual(
      this.service.queue.length,
      3,
      'it adds duplicate messages to the queue'
    );
  });

  test('it does not add duplicate messages to the queue if preventDuplicates is `true`', function (assert) {
    set(this, 'service.defaultPreventDuplicates', true);
    const messages = emberArray(['foo', 'foo', 'bar']);
    const expectedResult = messages.uniq();
    messages.forEach((message) => this.service.success(message));
    const result = this.service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it does not add duplicate messages to the queue'
    );
    assert.strictEqual(
      this.service.queue.length,
      2,
      'it does not add duplicate messages to the queue'
    );
  });

  test('it does not add duplicate messages to the queue if flashInstance preventDuplicates is `true`', function (assert) {
    set(this, 'service.defaultPreventDuplicates', false);
    const messages = emberArray(['foo', 'foo', 'bar']);
    const expectedResult = messages.uniq();
    messages.forEach((message) =>
      this.service.success(message, { preventDuplicates: true })
    );
    const result = this.service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it does not add duplicate messages to the queue'
    );
    assert.strictEqual(
      this.service.queue.length,
      2,
      'it does not add duplicate messages to the queue'
    );
  });

  test('flashInstance preventDuplicates prefers instance preventDuplicates over global', function (assert) {
    set(this, 'service.defaultPreventDuplicates', true);
    const messages = emberArray(['foo', 'foo', 'bar']);
    const expectedResult = ['foo', 'foo', 'bar'];
    messages.forEach((message) =>
      this.service.success(message, { preventDuplicates: false })
    );
    const result = this.service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it adds duplicate messages to the queue'
    );
    assert.strictEqual(
      this.service.queue.length,
      3,
      'it adds duplicate messages to the queue'
    );
  });

  test("it does use the global preventDuplicates if the instance option isn't set", function (assert) {
    set(this, 'service.defaultPreventDuplicates', false);
    this.service.success('foo');
    this.service.success('foo');
    this.service.success('bar', { preventDuplicates: true });
    this.service.success('bar', { preventDuplicates: true });
    this.service.success('foo');
    this.service.success('baz', { preventDuplicates: true });

    const result = this.service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      ['foo', 'foo', 'bar', 'foo', 'baz'],
      "it adds duplicated messages if preventDuplicates isn't set"
    );
    assert.strictEqual(
      this.service.queue.length,
      5,
      'it handles duplicates where preventDuplicates is false'
    );
  });

  test('it supports chaining', function (assert) {
    this.service
      .registerTypes(['meow'])
      .clearMessages()
      .add({ message: 'foo' })
      .meow('bar');

    assert.strictEqual(
      this.service.queue.at(0).message,
      'foo',
      'should support chaining'
    );
    assert.strictEqual(
      this.service.queue.at(-1).message,
      'bar',
      'should support chaining'
    );
  });

  test('it returns flash object when fetched through `getFlashObject`', function (assert) {
    const { flashMessageDefaults } = config;
    const flash = this.service
      .clearMessages()
      .add({ message: 'foo' })
      .getFlashObject();

    assert.strictEqual(
      flash.message,
      'foo',
      'it returns flash object with correct message'
    );
    assert.strictEqual(
      flash.timeout,
      flashMessageDefaults.timeout,
      'it returns an object with defaults'
    );
  });

  test('it supports public API methods for `peekLast` and `peekFirst`', function (assert) {
    this.service.clearMessages();

    assert.strictEqual(
      typeOf(this.service.peekLast()),
      'undefined',
      'returns undefined when queue is empty'
    );
    assert.strictEqual(
      typeOf(this.service.peekFirst()),
      'undefined',
      'returns undefined when queue is empty'
    );

    this.service.add({ message: 'foo' }).add({ message: 'bar' });

    assert.strictEqual(
      this.service.peekFirst().message,
      'foo',
      'returns first object from queue'
    );
    assert.strictEqual(
      this.service.peekLast().message,
      'bar',
      'returns last object from queue'
    );
  });
});
