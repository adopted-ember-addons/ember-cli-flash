import { run, later } from '@ember/runloop';
import { module, test } from 'qunit';
import { isDestroyed } from '@ember/destroyable';

import FlashMessage from '#src/flash/object.ts';
import { disableTimeout, enableTimeout } from '#src/test-support.ts';

const testTimerDuration = 50;

module('Unit | Flash | object', function (hooks) {
  hooks.beforeEach(function () {
    enableTimeout();
  });

  hooks.afterEach(function () {
    disableTimeout();
  });

  test('disableTimeout: it does not create a timer', function (assert) {
    disableTimeout();

    const flash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });

    assert.notOk(flash.timerTaskInstance, 'it does not create a timer');
  });

  test('enableTimeout: it sets a timer after init', function (assert) {
    disableTimeout();
    enableTimeout();

    const flash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });

    assert.ok(flash.timerTaskInstance, 'it does create a timer');
  });

  test('it sets a timer after init', function (assert) {
    const flash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });

    assert.ok(flash.timerTaskInstance);
  });

  test('it destroys the message after the timer has elapsed', function (assert) {
    const flash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });

    let result: string | undefined;
    const done = assert.async();

    flash.onDidDestroyMessage = () => {
      result = 'foo';
    };

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.true(isDestroyed(flash), 'it sets `isDestroyed` to true');
      assert.notOk(flash.timerTaskInstance, 'it cancels the timer');
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

    const stickyFlash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
      sticky: true,
    });

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.false(isDestroyed(stickyFlash), 'it is not destroyed');
      done();
    }, testTimerDuration);
  });

  test('#destroyMessage deletes the message and timer', function (assert) {
    const flash = new FlashMessage({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });

    // eslint-disable-next-line ember/no-runloop
    run(() => {
      flash.destroyMessage();
    });

    assert.true(isDestroyed(flash));
    assert.notOk(flash.timerTaskInstance);
  });

  test('it sets `exiting` to true after the timer has elapsed', function (assert) {
    const done = assert.async();

    const exitFlash = new FlashMessage({
      timeout: testTimerDuration,
      extendedTimeout: testTimerDuration,
    });

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.true(exitFlash.exiting, 'it sets `exiting` to true');
      assert.notOk(exitFlash.timerTaskInstance, 'it cancels the `timer`');
      done();
    }, testTimerDuration * 2);
  });

  test('it calls `onDestroy` when object is destroyed', function (assert) {
    const callbackFlash = new FlashMessage({
      sticky: true,
      onDestroy() {
        assert.ok(true, 'onDestroy is called');
      },
    });

    // eslint-disable-next-line ember/no-runloop
    run(() => {
      callbackFlash.destroyMessage();
    });
  });

  test('#pauseTimer cancels the timer', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
    });

    assert.ok(flash.timerTaskInstance, 'timer is created');

    flash.pauseTimer();

    assert.notOk(flash.timerTaskInstance, 'timer is cancelled');
  });

  test('#resumeTimer restarts the timer with remaining time', function (assert) {
    const done = assert.async();

    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration * 2,
    });

    // Pause after a short delay
    // eslint-disable-next-line ember/no-runloop
    later(() => {
      flash.pauseTimer();
      assert.notOk(flash.timerTaskInstance, 'timer is paused');

      flash.resumeTimer();
      assert.ok(flash.timerTaskInstance, 'timer is resumed');

      // Should still complete after remaining time
      // eslint-disable-next-line ember/no-runloop
      later(() => {
        assert.true(
          flash.exiting || isDestroyed(flash),
          'flash exits after resumed timer',
        );
        done();
      }, testTimerDuration * 2);
    }, testTimerDuration / 2);
  });

  test('#resumeTimer does nothing if already exiting', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
      sticky: true,
    });

    flash.exiting = true;
    flash.resumeTimer();

    assert.notOk(flash.timerTaskInstance, 'timer is not created when exiting');
  });

  test('#resumeTimer does nothing for sticky messages', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
      sticky: true,
    });

    flash.resumeTimer();

    assert.notOk(flash.timerTaskInstance, 'timer is not created for sticky');
  });

  test('#preventExit sets isExitable to false', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
    });

    assert.true(flash.isExitable, 'initially exitable');

    flash.preventExit();

    assert.false(flash.isExitable, 'no longer exitable');
  });

  test('#allowExit sets isExitable to true', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
    });

    flash.preventExit();
    assert.false(flash.isExitable);

    flash.allowExit();

    assert.true(flash.isExitable, 'exitable again');
  });

  test('#exitMessage does not exit when isExitable is false', function (assert) {
    const done = assert.async();

    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
    });

    flash.preventExit();

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.false(flash.exiting, 'does not exit when prevented');
      assert.false(isDestroyed(flash), 'not destroyed');
      done();
    }, testTimerDuration * 2);
  });

  test('#allowExit triggers exit if timeout elapsed', function (assert) {
    const done = assert.async();

    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
    });

    flash.preventExit();

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.false(flash.exiting, 'still not exiting');

      flash.allowExit();

      // eslint-disable-next-line ember/no-runloop
      later(() => {
        assert.true(
          flash.exiting || isDestroyed(flash),
          'exits after allowExit',
        );
        done();
      }, 10);
    }, testTimerDuration * 2);
  });

  test('extendedTimeout delays teardown', function (assert) {
    const done = assert.async();

    const flash = new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
      extendedTimeout: testTimerDuration,
      sticky: true,
    });

    // eslint-disable-next-line ember/no-runloop
    run(() => flash.destroyMessage());

    assert.true(flash.exiting, 'exiting is true');
    assert.false(isDestroyed(flash), 'not yet destroyed');

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.true(isDestroyed(flash), 'destroyed after extendedTimeout');
      done();
    }, testTimerDuration * 2);
  });

  test('#onDidExitMessage is called when exiting', function (assert) {
    const done = assert.async();
    let callbackCalled = false;

    new FlashMessage({
      message: 'test',
      timeout: testTimerDuration,
      onDidExitMessage: () => {
        callbackCalled = true;
      },
    });

    // eslint-disable-next-line ember/no-runloop
    later(() => {
      assert.true(callbackCalled, 'onDidExitMessage was called');
      done();
    }, testTimerDuration * 2);
  });

  test('no timer created when timeout is 0', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
      timeout: 0,
    });

    assert.notOk(flash.timerTaskInstance, 'no timer when timeout is 0');
  });

  test('no timer created when timeout is undefined', function (assert) {
    const flash = new FlashMessage({
      message: 'test',
    });

    assert.notOk(flash.timerTaskInstance, 'no timer when timeout is undefined');
  });
});
