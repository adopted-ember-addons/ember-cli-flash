import { module, test } from 'qunit';
import { run, later } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { isDestroyed } from '@ember/destroyable';
import { FlashMessageObject } from 'ember-cli-flash';
import { disableTimeout, enableTimeout } from 'ember-cli-flash/test-support';

const testTimerDuration = 50;
let flash: FlashMessageObject | null = null;

module('FlashMessageObject disableTimeout', function (hooks) {
  hooks.beforeEach(function () {
    disableTimeout();
    flash = new FlashMessageObject({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      // service: {},
    });
  });

  hooks.afterEach(function () {
    flash = null;
    enableTimeout();
  });

  test('it does not create a timer', function (assert) {
    assert.notOk(flash?.timerTaskInstance, 'it does not create a timer');
  });
});

module('FlashMessageObject enableTimeout', function (hooks) {
  hooks.beforeEach(function () {
    disableTimeout();
    enableTimeout();
    flash = new FlashMessageObject({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      // service: {},
    });
  });

  hooks.afterEach(function () {
    flash = null;
  });

  test('it sets a timer after init', function (assert) {
    assert.ok(isPresent(flash?.timerTaskInstance), 'it does create a timer');
  });
});

module('FlashMessageObject', function (hooks) {
  hooks.beforeEach(function () {
    flash = new FlashMessageObject({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      // service: {},
    });
  });

  hooks.afterEach(function () {
    run(() => {
      flash?.destroyMessage();
    });
    flash = null;
  });

  test('it sets a timer after init', function (assert) {
    assert.ok(isPresent(flash?.timerTaskInstance));
  });

  test('it destroys the message after the timer has elapsed', function (assert) {
    let result: string | null = null;
    const done = assert.async();
    assert.expect(3);

    if (flash) {
      flash['onDidDestroyMessage'] = () => {
        result = 'foo';
      };
    }

    later(() => {
      assert.true(
        isDestroyed(flash as object),
        'it sets `isDestroyed` to true',
      );
      assert.notOk(flash?.['timer'], 'it cancels the timer');
      assert.strictEqual(
        result,
        'foo',
        'it called the `onDidDestroyMessage` callback',
      );
      done();
    }, testTimerDuration * 2);
  });

  test('it does not destroy the message if it is sticky', function (assert) {
    const done = assert.async();
    assert.expect(1);

    const stickyFlash = new FlashMessageObject({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      // service: {},
      sticky: true,
    });

    later(() => {
      assert.false(isDestroyed(stickyFlash), 'it is not destroyed');
      done();
    }, testTimerDuration);
  });

  test('#destroyMessage deletes the message and timer', function (assert) {
    assert.expect(2);

    run(() => {
      flash?.destroyMessage();
    });

    assert.true(isDestroyed(flash as object));
    assert.notOk(flash?.['timer']);
  });

  test('it sets `exiting` to true after the timer has elapsed', function (assert) {
    assert.expect(2);
    const done = assert.async();

    const exitFlash = new FlashMessageObject({
      timeout: testTimerDuration,
      extendedTimeout: testTimerDuration,
    });

    later(() => {
      assert.true(exitFlash.exiting, 'it sets `exiting` to true');
      assert.notOk(exitFlash['timer'], 'it cancels the `timer`');
      done();
    }, testTimerDuration * 2);
  });

  test('it calls `onDestroy` when object is destroyed', function (assert) {
    assert.expect(1);

    const callbackFlash = new FlashMessageObject({
      sticky: true,
      onDestroy() {
        assert.ok(true, 'onDestroy is called');
      },
    });

    run(() => {
      callbackFlash.destroyMessage();
    });
  });
});
