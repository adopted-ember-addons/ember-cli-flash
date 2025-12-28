import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

import FlashMessagesService from '#src/services/flash-messages.ts';
import { disableTimeout, enableTimeout } from '#src/test-support.ts';

import type { TestContext as BaseTestContext } from '@ember/test-helpers';

// Extend TestContext to include our test properties
interface TestContext extends BaseTestContext {
  flashMessages: FlashMessagesService;
  customFlashMessages: FlashMessagesService;
}

module('Acceptance | Flash Messages', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    this.flashMessages = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
  });

  hooks.afterEach(function (this: TestContext) {
    this.flashMessages.clearMessages();
  });

  module('Basic message types', function () {
    test('it adds success message to queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('Operation completed!');

      assert.strictEqual(this.flashMessages.queue.length, 1);
      assert.strictEqual(
        this.flashMessages.queue[0]?.message,
        'Operation completed!',
      );
      assert.strictEqual(this.flashMessages.queue[0]?.type, 'success');
    });

    test('it adds info message to queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.info('Here is some information');

      assert.strictEqual(this.flashMessages.queue.length, 1);
      assert.strictEqual(this.flashMessages.queue[0]?.type, 'info');
    });

    test('it adds warning message to queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.warning('Watch out!');

      assert.strictEqual(this.flashMessages.queue.length, 1);
      assert.strictEqual(this.flashMessages.queue[0]?.type, 'warning');
    });

    test('it adds danger message to queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.danger('Something went wrong');

      assert.strictEqual(this.flashMessages.queue.length, 1);
      assert.strictEqual(this.flashMessages.queue[0]?.type, 'danger');
    });

    test('it adds multiple messages to queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('First');
      this.flashMessages.info('Second');
      this.flashMessages.warning('Third');

      assert.strictEqual(this.flashMessages.queue.length, 3);
    });
  });

  module('Message options', function () {
    test('sticky messages remain in queue', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.info('Sticky message', { sticky: true });

      assert.strictEqual(this.flashMessages.queue.length, 1);
      assert.true(this.flashMessages.queue[0]?.sticky);
    });

    test('priority affects arrangedQueue order', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.info('Low priority', { priority: 100, sticky: true });
      this.flashMessages.warning('High priority', {
        priority: 500,
        sticky: true,
      });
      this.flashMessages.success('Medium priority', {
        priority: 200,
        sticky: true,
      });

      const arranged = this.flashMessages.arrangedQueue;

      assert.strictEqual(
        arranged[0]?.message,
        'High priority',
        'Highest priority first',
      );
      assert.strictEqual(
        arranged[1]?.message,
        'Medium priority',
        'Medium priority second',
      );
      assert.strictEqual(
        arranged[2]?.message,
        'Low priority',
        'Low priority last',
      );
    });

    test('showProgress option is set on flash', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('With progress', {
        showProgress: true,
        sticky: true,
      });

      assert.true(this.flashMessages.queue[0]?.showProgress);
    });

    test('custom options are passed through', async function (this: TestContext, assert) {
      await visit('/');

      interface CustomOptions extends Record<string, unknown> {
        customField: string;
        count: number;
      }

      const flashMessages = this
        .flashMessages as unknown as FlashMessagesService<CustomOptions>;
      flashMessages.add({
        message: 'Custom message',
        customField: 'custom-value',
        count: 42,
        sticky: true,
      });

      const flash = flashMessages.queue[0];
      assert.strictEqual(
        flash?.customField,
        'custom-value',
        'Custom field is accessible',
      );
      assert.strictEqual(flash?.count, 42, 'Custom count is accessible');
    });
  });

  module('Queue operations', function () {
    test('clearMessages removes all messages', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('First');
      this.flashMessages.info('Second');
      this.flashMessages.warning('Third');

      assert.strictEqual(this.flashMessages.queue.length, 3);

      this.flashMessages.clearMessages();

      assert.strictEqual(this.flashMessages.queue.length, 0);
    });

    test('findBy locates message by custom field', async function (this: TestContext, assert) {
      await visit('/');

      interface WithId extends Record<string, unknown> {
        id: string;
      }
      const flashMessages = this
        .flashMessages as unknown as FlashMessagesService<WithId>;

      flashMessages.add({ message: 'First', id: 'msg-1', sticky: true });
      flashMessages.add({ message: 'Second', id: 'msg-2', sticky: true });
      flashMessages.add({ message: 'Third', id: 'msg-3', sticky: true });

      const found = flashMessages.findBy('id', 'msg-2');
      assert.strictEqual(found?.message, 'Second', 'Found correct message');
    });

    test('removeBy removes message by custom field', async function (this: TestContext, assert) {
      await visit('/');

      interface WithId extends Record<string, unknown> {
        id: string;
      }
      const flashMessages = this
        .flashMessages as unknown as FlashMessagesService<WithId>;

      flashMessages.add({ message: 'First', id: 'msg-1', sticky: true });
      flashMessages.add({ message: 'Second', id: 'msg-2', sticky: true });
      flashMessages.add({ message: 'Third', id: 'msg-3', sticky: true });

      assert.strictEqual(flashMessages.queue.length, 3);

      const removed = flashMessages.removeBy('id', 'msg-2');

      assert.true(removed, 'removeBy returns true when message found');
      assert.strictEqual(flashMessages.queue.length, 2);
      assert.notOk(flashMessages.findBy('id', 'msg-2'), 'Message was removed');
    });

    test('peekFirst returns first message', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.add({ message: 'First', sticky: true });
      this.flashMessages.add({ message: 'Second', sticky: true });

      const first = this.flashMessages.peekFirst();
      assert.strictEqual(first?.message, 'First');
    });

    test('peekLast returns last message', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.add({ message: 'First', sticky: true });
      this.flashMessages.add({ message: 'Second', sticky: true });

      const last = this.flashMessages.peekLast();
      assert.strictEqual(last?.message, 'Second');
    });

    test('getFlashObject returns last message', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('Test message');

      const flash = this.flashMessages.getFlashObject();
      assert.strictEqual(flash.message, 'Test message');
    });

    test('isEmpty returns correct state', async function (this: TestContext, assert) {
      await visit('/');

      assert.true(this.flashMessages.isEmpty, 'Initially empty');

      this.flashMessages.success('Test');
      assert.false(this.flashMessages.isEmpty, 'Not empty after adding');

      this.flashMessages.clearMessages();
      assert.true(this.flashMessages.isEmpty, 'Empty after clearing');
    });
  });

  module('Prevent duplicates', function () {
    test('allows duplicates by default', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('Same message');
      this.flashMessages.success('Same message');
      this.flashMessages.success('Same message');

      assert.strictEqual(
        this.flashMessages.queue.length,
        3,
        'All duplicates added',
      );
    });

    test('prevents duplicates when option is set', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.success('Same message', { preventDuplicates: true });
      this.flashMessages.success('Same message', { preventDuplicates: true });
      this.flashMessages.success('Same message', { preventDuplicates: true });

      assert.strictEqual(
        this.flashMessages.queue.length,
        1,
        'Only one message added',
      );
    });

    test('prevents duplicates when default is set', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.defaultPreventDuplicates = true;

      this.flashMessages.success('Same message');
      this.flashMessages.success('Same message');
      this.flashMessages.success('Different message');

      assert.strictEqual(
        this.flashMessages.queue.length,
        2,
        'Only unique messages added',
      );
    });

    test('instance option overrides default', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.defaultPreventDuplicates = true;

      this.flashMessages.success('Same message', { preventDuplicates: false });
      this.flashMessages.success('Same message', { preventDuplicates: false });

      assert.strictEqual(
        this.flashMessages.queue.length,
        2,
        'Duplicates allowed via instance option',
      );
    });
  });

  module('Custom types', function () {
    test('registerTypes creates new methods', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.registerTypes(['custom', 'special']);

      assert.ok(
        typeof (this.flashMessages as unknown as Record<string, unknown>)[
          'custom'
        ] === 'function',
        'custom method exists',
      );
      assert.ok(
        typeof (this.flashMessages as unknown as Record<string, unknown>)[
          'special'
        ] === 'function',
        'special method exists',
      );

      (this.flashMessages as unknown as Record<string, (msg: string) => void>)[
        'custom'
      ]!('Custom message');

      assert.strictEqual(this.flashMessages.queue[0]?.type, 'custom');
    });
  });

  module('Chaining', function () {
    test('methods support chaining', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.registerTypes(['custom']);
      this.flashMessages.clearMessages();
      this.flashMessages
        .add({ message: 'Added via add', sticky: true })
        .success('Success message', { sticky: true })
        .info('Info message', { sticky: true });

      assert.strictEqual(
        this.flashMessages.queue.length,
        3,
        'All messages added via chaining',
      );
    });
  });

  module('destroyOnClick option', function () {
    test('destroyOnClick defaults to true', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.info('Default behavior', { sticky: true });

      assert.true(this.flashMessages.queue[0]?.destroyOnClick);
    });

    test('destroyOnClick can be set to false', async function (this: TestContext, assert) {
      await visit('/');

      this.flashMessages.info('Cannot dismiss by clicking', {
        sticky: true,
        destroyOnClick: false,
      });

      assert.false(this.flashMessages.queue[0]?.destroyOnClick);
    });
  });
});

module('Acceptance | Test Helpers', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    this.flashMessages = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
  });

  hooks.afterEach(function (this: TestContext) {
    this.flashMessages.clearMessages();
    enableTimeout();
  });

  test('disableTimeout prevents timer creation', async function (this: TestContext, assert) {
    disableTimeout();

    await visit('/');

    this.flashMessages.success('Should stay', { timeout: 1, sticky: false });

    const flash = this.flashMessages.queue[0];
    assert.notOk(
      flash?.timerTaskInstance,
      'No timer created when timeout disabled',
    );
  });

  test('enableTimeout allows timer creation', async function (this: TestContext, assert) {
    enableTimeout();

    await visit('/');

    this.flashMessages.success('Has timer', { timeout: 5000, sticky: false });

    const flash = this.flashMessages.queue[0];
    assert.ok(
      flash?.timerTaskInstance,
      'Timer is created when timeout enabled',
    );
  });
});

module('Acceptance | Custom Service Defaults (Subclass)', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    // Create a custom service with different defaults via subclassing
    class CustomFlashMessages extends FlashMessagesService {
      get flashMessageDefaults() {
        return {
          ...super.flashMessageDefaults,
          timeout: 10000,
          sticky: true,
          type: 'warning',
          types: ['success', 'info', 'warning', 'danger', 'custom-type'],
        };
      }
    }

    this.owner.register('service:custom-flash-messages', CustomFlashMessages);
    this.customFlashMessages = this.owner.lookup(
      'service:custom-flash-messages',
    ) as FlashMessagesService;
  });

  hooks.afterEach(function (this: TestContext) {
    this.customFlashMessages.clearMessages();
  });

  test('custom service uses overridden defaults', async function (this: TestContext, assert) {
    await visit('/');

    assert.strictEqual(
      this.customFlashMessages.defaultTimeout,
      10000,
      'Custom timeout',
    );
    assert.true(this.customFlashMessages.defaultSticky, 'Custom sticky');
    assert.strictEqual(
      this.customFlashMessages.defaultType,
      'warning',
      'Custom type',
    );
  });

  test('custom types are registered', async function (this: TestContext, assert) {
    await visit('/');

    assert.ok(
      typeof (this.customFlashMessages as unknown as Record<string, unknown>)[
        'custom-type'
      ] === 'function',
      'Custom type method exists',
    );
  });

  test('messages use custom defaults', async function (this: TestContext, assert) {
    await visit('/');

    this.customFlashMessages.add({ message: 'Uses custom defaults' });

    const flash = this.customFlashMessages.queue[0];
    assert.strictEqual(flash?.type, 'warning', 'Uses custom default type');
    assert.true(flash?.sticky, 'Uses custom default sticky');
  });
});

module('Acceptance | Generic Type Support', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    this.flashMessages = this.owner.lookup(
      'service:flash-messages',
    ) as FlashMessagesService;
  });

  hooks.afterEach(function (this: TestContext) {
    this.flashMessages.clearMessages();
  });

  test('service can be typed with custom interface', async function (this: TestContext, assert) {
    await visit('/');

    // Define a custom interface for typed flash messages
    interface NotificationOptions extends Record<string, unknown> {
      notificationId: string;
      category: 'system' | 'user' | 'admin';
      dismissible: boolean;
    }

    // Type the service with custom options
    const typedFlash = this
      .flashMessages as unknown as FlashMessagesService<NotificationOptions>;

    typedFlash.add({
      message: 'System notification',
      notificationId: 'sys-001',
      category: 'system',
      dismissible: true,
      sticky: true,
    });

    const flash = typedFlash.queue[0];
    assert.strictEqual(flash?.notificationId, 'sys-001');
    assert.strictEqual(flash?.category, 'system');
    assert.true(flash?.dismissible);
  });

  test('findBy works with custom typed fields', async function (this: TestContext, assert) {
    await visit('/');

    interface OrderNotification extends Record<string, unknown> {
      orderId: number;
      status: 'pending' | 'shipped' | 'delivered';
    }

    const typedFlash = this
      .flashMessages as unknown as FlashMessagesService<OrderNotification>;

    typedFlash.add({
      message: 'Order #1 pending',
      orderId: 1,
      status: 'pending',
      sticky: true,
    });
    typedFlash.add({
      message: 'Order #2 shipped',
      orderId: 2,
      status: 'shipped',
      sticky: true,
    });
    typedFlash.add({
      message: 'Order #3 delivered',
      orderId: 3,
      status: 'delivered',
      sticky: true,
    });

    const shipped = typedFlash.findBy('status', 'shipped');
    assert.strictEqual(shipped?.orderId, 2, 'Found order by status');

    const order3 = typedFlash.findBy('orderId', 3);
    assert.strictEqual(order3?.status, 'delivered', 'Found order by orderId');
  });

  test('removeBy works with custom typed fields', async function (this: TestContext, assert) {
    await visit('/');

    interface TaskNotification extends Record<string, unknown> {
      taskId: string;
      priorityLevel: string;
    }

    const typedFlash = this
      .flashMessages as unknown as FlashMessagesService<TaskNotification>;

    typedFlash.add({
      message: 'Low priority task',
      taskId: 'task-1',
      priorityLevel: 'low',
      sticky: true,
    });
    typedFlash.add({
      message: 'High priority task',
      taskId: 'task-2',
      priorityLevel: 'high',
      sticky: true,
    });
    typedFlash.add({
      message: 'Medium priority task',
      taskId: 'task-3',
      priorityLevel: 'medium',
      sticky: true,
    });

    assert.strictEqual(typedFlash.queue.length, 3);

    typedFlash.removeBy('priorityLevel', 'high');

    assert.strictEqual(typedFlash.queue.length, 2);
    assert.notOk(
      typedFlash.findBy('priorityLevel', 'high'),
      'High priority removed',
    );
  });

  test('typed service with subclass preserves generics', async function (this: TestContext, assert) {
    await visit('/');

    // Define custom options interface
    interface AppNotification extends Record<string, unknown> {
      source: string;
      action?: string;
    }

    // Create typed subclass
    class AppFlashMessages extends FlashMessagesService<AppNotification> {
      get flashMessageDefaults() {
        return {
          ...super.flashMessageDefaults,
          sticky: true,
        };
      }
    }

    this.owner.register('service:app-flash-messages', AppFlashMessages);
    const appFlash = this.owner.lookup(
      'service:app-flash-messages',
    ) as AppFlashMessages;

    appFlash.add({
      message: 'File uploaded',
      source: 'upload-service',
      action: 'upload',
    });

    const flash = appFlash.queue[0];
    assert.strictEqual(flash?.source, 'upload-service');
    assert.strictEqual(flash?.action, 'upload');
    assert.true(flash?.sticky, 'Uses subclass default');

    appFlash.clearMessages();
  });
});
