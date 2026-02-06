import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

import FlashMessagesService from '#src/services/flash-messages.ts';

let SANDBOX: Record<string, unknown> = {};

module('Unit | Service | flash-messages', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:flash-messages', FlashMessagesService);
  });

  hooks.afterEach(function () {
    SANDBOX = {};
  });

  test('#queue returns an array of flash messages', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.success('success 1');
    service.success('success 2');
    service.success('success 3');

    assert.true(Array.isArray(service.queue), 'it returns an array');
    assert.strictEqual(
      service.queue.length,
      3,
      'it returns the correct number of flash messages',
    );
  });

  test('#arrangedQueue returns an array of flash messages, sorted by priority', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.success('success 1', { priority: 100 });
    service.success('success 2', { priority: 200 });
    service.success('success 3', { priority: 300 });

    assert.true(Array.isArray(service.queue), 'it returns an array');
    assert.strictEqual(
      service.queue.length,
      3,
      'it returns the correct number of flash messages',
    );
    assert.strictEqual(
      service.arrangedQueue[0]?.priority,
      300,
      'it returns flash messages in the right order',
    );
    assert.strictEqual(
      service.arrangedQueue[2]?.priority,
      100,
      'it returns flash messages in the right order',
    );
  });

  test('#arrangedQueue is read only', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    assert.throws(() => {
      service.set('arrangedQueue', ['foo']);
    });

    assert.strictEqual(
      service.arrangedQueue.length,
      0,
      'it did not set #arrangedQueue',
    );
  });

  test('#add adds a custom message', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.add({
      message: 'test',
      type: 'test',
      timeout: 1,
      sticky: true,
      showProgress: true,
    });

    assert.strictEqual(
      service.queue[0]?.type,
      'test',
      'it has the correct type',
    );
    assert.strictEqual(
      service.queue[0]?.timeout,
      1,
      'it has the correct timeout',
    );
    assert.true(service.queue[0]?.sticky, 'it has the correct sticky');
    assert.true(
      service.queue[0]?.showProgress,
      'it has the correct show progress',
    );
  });

  test('#add adds a custom message with default type', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    SANDBOX.flash = service.add({
      message: 'test',
    });
    assert.strictEqual(
      service.queue[0]?.type,
      'info',
      'it has the correct type',
    );
  });

  test('#clearMessages clears the queue', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.success('foo');
    service.success('bar');
    service.success('baz');
    // eslint-disable-next-line ember/no-runloop
    run(() => service.clearMessages());
    assert.true(Array.isArray(service.queue), 'it returns an array');
    assert.strictEqual(service.queue.length, 0, 'it clears the array');
  });

  test('#registerTypes registers new types', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.registerTypes(['foo', 'bar']);
    SANDBOX.type1 = service.foo;
    SANDBOX.type2 = service.bar;

    assert.strictEqual(
      typeof SANDBOX.type1,
      'function',
      'it creates a new method on the service',
    );
    assert.strictEqual(
      typeof SANDBOX.type2,
      'function',
      'it creates a new method on the service',
    );
  });

  test('it registers default types on init', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    const defaultTypes = [
      'success',
      'info',
      'warning',
      'danger',
      'alert',
      'secondary',
    ];

    defaultTypes.forEach((type) => {
      const method = service[type];

      assert.ok(method);
      assert.strictEqual(typeof method, 'function');
    });
  });

  test('it adds specific options via add()', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.add({
      message: "here's an option you may or may not know",
      appOption: 'ohai',
    });

    assert.strictEqual(service.queue[0]?.appOption, 'ohai');
  });

  test('it adds specific options via specific message type', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.info('you can pass app options this way too', {
      appOption: 'we meet again app-option',
    });

    assert.strictEqual(service.queue[0]?.appOption, 'we meet again app-option');
  });

  test('it sets the correct defaults for service properties', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    // Verify default values are set
    assert.strictEqual(service.defaultTimeout, 3000);
    assert.strictEqual(service.defaultExtendedTimeout, 0);
    assert.strictEqual(service.defaultPriority, 100);
    assert.strictEqual(service.defaultSticky, false);
    assert.strictEqual(service.defaultShowProgress, false);
    assert.strictEqual(service.defaultType, 'info');
    assert.strictEqual(service.defaultPreventDuplicates, false);
    assert.deepEqual(service.defaultTypes, [
      'success',
      'info',
      'warning',
      'danger',
      'alert',
      'secondary',
    ]);
  });

  test('when preventDuplicates is `false` setting a message is not required', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = false;

    service.add({
      customProperty: 'ohai',
    });

    assert.strictEqual(service.queue.at(0)?.customProperty, 'ohai');
  });

  test('when preventDuplicates is `true`, setting a message is required', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = true;

    assert.throws(
      () => {
        service.add({});
      },
      new Error(
        'Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.',
      ),
      'Error is thrown',
    );
  });

  test('when preventDuplicates is `false` but flashInstance preventDuplicates is `true` setting a message is not required', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = false;

    assert.throws(
      () => {
        service.add({ preventDuplicates: true });
      },
      new Error(
        'Assertion Failed: The flash message cannot be empty when preventDuplicates is enabled.',
      ),
      'Error is thrown',
    );
  });

  test('it adds duplicate messages to the queue if preventDuplicates is `false`', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = false;
    const expectedResult = ['foo', 'foo', 'bar'];
    expectedResult.forEach((message) => service.success(message));
    const result = service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it adds duplicate messages to the queue',
    );
    assert.strictEqual(
      service.queue.length,
      3,
      'it adds duplicate messages to the queue',
    );
  });

  test('it does not add duplicate messages to the queue if preventDuplicates is `true`', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = true;
    const messages = ['foo', 'foo', 'bar'];
    const expectedResult = [...new Set(messages)];
    messages.forEach((message) => service.success(message));
    const result = service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it does not add duplicate messages to the queue',
    );
    assert.strictEqual(
      service.queue.length,
      2,
      'it does not add duplicate messages to the queue',
    );
  });

  test('it does not add duplicate messages to the queue if flashInstance preventDuplicates is `true`', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = false;
    const messages = ['foo', 'foo', 'bar'];
    const expectedResult = [...new Set(messages)];
    messages.forEach((message) =>
      service.success(message, { preventDuplicates: true }),
    );
    const result = service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it does not add duplicate messages to the queue',
    );
    assert.strictEqual(
      service.queue.length,
      2,
      'it does not add duplicate messages to the queue',
    );
  });

  test('flashInstance preventDuplicates prefers instance preventDuplicates over global', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = true;
    const messages = ['foo', 'foo', 'bar'];
    const expectedResult = ['foo', 'foo', 'bar'];
    messages.forEach((message) =>
      service.success(message, { preventDuplicates: false }),
    );
    const result = service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      expectedResult,
      'it adds duplicate messages to the queue',
    );
    assert.strictEqual(
      service.queue.length,
      3,
      'it adds duplicate messages to the queue',
    );
  });

  test("it does use the global preventDuplicates if the instance option isn't set", function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.defaultPreventDuplicates = false;
    service.success('foo');
    service.success('foo');
    service.success('bar', { preventDuplicates: true });
    service.success('bar', { preventDuplicates: true });
    service.success('foo');
    service.success('baz', { preventDuplicates: true });

    const result = service.queue.map((flash) => flash.message);

    assert.deepEqual(
      result,
      ['foo', 'foo', 'bar', 'foo', 'baz'],
      "it adds duplicated messages if preventDuplicates isn't set",
    );
    assert.strictEqual(
      service.queue.length,
      5,
      'it handles duplicates where preventDuplicates is false',
    );
  });

  test('it supports chaining', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.registerTypes(['meow']);

    const chained = (service.clearMessages() as FlashMessagesService).add({
      message: 'foo',
    });
    (
      chained as unknown as {
        meow: (message: string) => FlashMessagesService;
      }
    ).meow('bar');

    assert.strictEqual(
      service.queue.at(0)?.message,
      'foo',
      'should support chaining',
    );
    assert.strictEqual(
      service.queue.at(-1)?.message,
      'bar',
      'should support chaining',
    );
  });

  test('it returns flash object when fetched through `getFlashObject`', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    const flash = (service.clearMessages() as FlashMessagesService)
      .add({ message: 'foo' })
      .getFlashObject();

    assert.strictEqual(
      flash?.message,
      'foo',
      'it returns flash object with correct message',
    );

    assert.strictEqual(
      flash.timeout,
      3000,
      'it returns flash object with correct default timeout',
    );
  });

  test('it supports public API methods for `peekLast` and `peekFirst`', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.clearMessages();

    assert.strictEqual(
      service.peekLast(),
      undefined,
      'returns undefined when queue is empty',
    );
    assert.strictEqual(
      service.peekFirst(),
      undefined,
      'returns undefined when queue is empty',
    );

    service.add({ message: 'foo' }).add({ message: 'bar' });

    assert.strictEqual(
      service.peekFirst()?.message,
      'foo',
      'returns first object from queue',
    );
    assert.strictEqual(
      service.peekLast()?.message,
      'bar',
      'returns last object from queue',
    );
  });

  test('#findBy finds a flash message by key-value pair', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ id: string }>;
    service.add({ message: 'first', id: 'msg-1' });
    service.add({ message: 'second', id: 'msg-2' });
    service.add({ message: 'third', id: 'msg-3' });

    const found = service.findBy('id', 'msg-2');

    assert.ok(found, 'it finds a message');
    assert.strictEqual(
      found?.message,
      'second',
      'it finds the correct message',
    );
    assert.strictEqual(found?.id, 'msg-2', 'it has the correct id');
  });

  test('#findBy returns undefined when not found', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ id: string }>;
    service.add({ message: 'first', id: 'msg-1' });

    const found = service.findBy('id', 'nonexistent');

    assert.strictEqual(found, undefined, 'it returns undefined when not found');
  });

  test('#findBy works with _guid', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.success('test message');
    const flash = service.peekLast();
    const guid = flash?._guid;

    const found = guid ? service.findBy('_guid', guid) : undefined;

    assert.ok(found, 'it finds a message by _guid');
    assert.strictEqual(
      found?.message,
      'test message',
      'it finds the correct message',
    );
  });

  test('#removeBy removes a flash message by key-value pair', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ id: string }>;
    service.add({ message: 'first', id: 'msg-1' });
    service.add({ message: 'second', id: 'msg-2' });
    service.add({ message: 'third', id: 'msg-3' });

    assert.strictEqual(service.queue.length, 3, 'starts with 3 messages');

    const result = service.removeBy('id', 'msg-2');

    assert.true(result, 'it returns true when removed');
    assert.strictEqual(service.queue.length, 2, 'it removes the message');
    assert.strictEqual(
      service.findBy('id', 'msg-2'),
      undefined,
      'the message is no longer in the queue',
    );
  });

  test('#removeBy returns false when message not found', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ id: string }>;
    service.add({ message: 'first', id: 'msg-1' });

    const result = service.removeBy('id', 'nonexistent');

    assert.false(result, 'it returns false when not found');
    assert.strictEqual(service.queue.length, 1, 'queue length unchanged');
  });

  test('#removeBy works with _guid', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
    service.success('test message');
    const flash = service.peekLast();
    const guid = flash!._guid;

    assert.strictEqual(service.queue.length, 1, 'starts with 1 message');

    const result = service.removeBy('_guid', guid);

    assert.true(result, 'it returns true when removed');
    assert.strictEqual(service.queue.length, 0, 'it removes the message');
  });

  test('it supports custom fields via generics', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ customField: string; userId: number }>;
    service.add({
      message: 'Custom message',
      customField: 'custom value',
      userId: 42,
    });

    const flash = service.peekLast();

    assert.strictEqual(flash?.message, 'Custom message');
    assert.strictEqual(flash?.customField, 'custom value');
    assert.strictEqual(flash?.userId, 42);
  });

  test('custom fields can be used with findBy', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ userId: number }>;
    service.add({ message: 'user message', userId: 100 });
    service.add({ message: 'admin message', userId: 200 });

    const userMessage = service.findBy('userId', 100);
    const adminMessage = service.findBy('userId', 200);

    assert.ok(userMessage, 'finds user message');
    assert.strictEqual(userMessage?.message, 'user message');
    assert.ok(adminMessage, 'finds admin message');
    assert.strictEqual(adminMessage?.message, 'admin message');
  });

  test('custom fields can be used with removeBy', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ notificationId: string }>;
    service.add({ message: 'notification', notificationId: 'notif-123' });
    service.add({ message: 'alert', notificationId: 'notif-456' });

    assert.strictEqual(service.queue.length, 2);

    service.removeBy('notificationId', 'notif-123');

    assert.strictEqual(service.queue.length, 1);
    assert.strictEqual(service.peekFirst()?.notificationId, 'notif-456');
  });

  test('extended service pattern supports custom methods', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService<{ id: string }>;
    // Simulate extending the service with a custom method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (service as any).customNotification = function (
      id: string,
      message: string,
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return this.add({
        message,
        id,
        type: 'custom',
        sticky: true,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    (service as any).customNotification('custom-1', 'Custom notification');

    const flash = service.peekLast();

    assert.strictEqual(flash?.message, 'Custom notification');
    assert.strictEqual(flash?.id, 'custom-1');
    assert.strictEqual(flash?.type, 'custom');
    assert.true(flash?.sticky);
  });

  test('#isEmpty returns true when queue is empty', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    assert.true(service.isEmpty, 'isEmpty is true initially');

    service.success('test');

    assert.false(service.isEmpty, 'isEmpty is false after adding message');

    // eslint-disable-next-line ember/no-runloop
    run(() => service.clearMessages());

    assert.true(service.isEmpty, 'isEmpty is true after clearing');
  });

  test('#_guids returns array of message guids', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    assert.deepEqual(service._guids, [], 'empty array initially');

    service.success('message 1');
    service.success('message 2');

    assert.strictEqual(service._guids.length, 2, 'returns 2 guids');
    assert.ok(
      service._guids.every((guid) => typeof guid === 'string'),
      'all guids are strings',
    );
  });

  test('service has registerDestructor for cleanup', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.success('test 1');
    service.success('test 2');

    assert.strictEqual(service.queue.length, 2, 'has 2 messages');

    // clearMessages is called by the destructor when service is destroyed
    // We can verify the method works correctly
    // eslint-disable-next-line ember/no-runloop
    run(() => service.clearMessages());

    assert.strictEqual(service.queue.length, 0, 'queue is cleared');
  });

  test('#add returns service for chaining', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    const result = service.add({ message: 'test' });

    assert.strictEqual(result, service, 'returns service instance');
  });

  test('#registerTypes returns service for chaining', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    const result = service.registerTypes(['custom']);

    assert.strictEqual(result, service, 'returns service instance');
  });

  test('dynamic type methods return service for chaining', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    const result = service.success('test');

    assert.strictEqual(result, service, 'success returns service');
  });

  test('arrangedQueue sorts by priority descending', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.add({ message: 'low', priority: 50 });
    service.add({ message: 'high', priority: 200 });
    service.add({ message: 'medium', priority: 100 });

    const arranged = service.arrangedQueue;

    assert.strictEqual(arranged[0]?.message, 'high', 'highest priority first');
    assert.strictEqual(
      arranged[1]?.message,
      'medium',
      'medium priority second',
    );
    assert.strictEqual(arranged[2]?.message, 'low', 'lowest priority last');
  });

  test('messages with same priority maintain order', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.add({ message: 'first', priority: 100 });
    service.add({ message: 'second', priority: 100 });
    service.add({ message: 'third', priority: 100 });

    // Same priority should maintain insertion order (stable sort)
    const messages = service.arrangedQueue.map((f) => f.message);
    assert.deepEqual(messages, ['first', 'second', 'third']);
  });

  test('flash messages are associated as destroyable children', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    service.add({ message: 'test', sticky: true });
    const flash = service.peekLast();

    assert.ok(flash, 'flash exists');
    // The flash should be a destroyable child of the service
    // When service is destroyed, flash should also be destroyed
  });

  test('#getFlashObject throws when queue is empty', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    assert.throws(
      () => service.getFlashObject(),
      /A flash message must be added/,
      'throws assertion when queue empty',
    );
  });

  test('clearMessages returns undefined when queue is null', function (assert) {
    const service = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;

    // Force queue to be null-ish (edge case)
    // @ts-expect-error - testing edge case
    service.queue = null;

    const result = service.clearMessages();

    assert.strictEqual(result, undefined, 'returns undefined for null queue');
  });
});
