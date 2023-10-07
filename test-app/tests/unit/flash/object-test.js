import { run, later } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { module, test } from 'qunit';
import FlashMessage from 'ember-cli-flash/flash/object';
import { disableTimers, enableTimers } from 'ember-cli-flash/test-support';

const testTimerDuration = 50;
let flash = null;

module('FlashMessageObject disableTimers', function (hooks) {
  hooks.beforeEach(function () {
    disableTimers();
    flash = FlashMessage.create({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });
  });

  hooks.afterEach(function () {
    flash = null;
    enableTimers();
  });

  test('it does not create a timer', function (assert) {
    assert.notOk(flash.get('timerTaskInstance'), 'it does not create a timer');
  });
});

module('FlashMessageObject enableTimers', function (hooks) {
  hooks.beforeEach(function () {
    disableTimers();
    enableTimers();
    flash = FlashMessage.create({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });
  });

  hooks.afterEach(function () {
    flash = null;
  });

  test('it sets a timer after init', function (assert) {
    assert.ok(
      isPresent(flash.get('timerTaskInstance')),
      'it does create a timer'
    );
  });
});

module('FlashMessageObject', function (hooks) {
  hooks.beforeEach(function () {
    flash = FlashMessage.create({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
    });
  });

  hooks.afterEach(function () {
    run(() => {
      flash.destroyMessage();
    });
    flash = null;
  });

  test('it sets a timer after init', function (assert) {
    assert.ok(isPresent(flash.get('timerTaskInstance')));
  });

  test('it destroys the message after the timer has elapsed', function (assert) {
    let result;
    const done = assert.async();
    assert.expect(3);

    flash.on('didDestroyMessage', () => {
      result = 'foo';
    });

    later(() => {
      assert.true(flash.isDestroyed, 'it sets `isDestroyed` to true');
      assert.notOk(flash.timer, 'it cancels the timer');
      assert.strictEqual(
        result,
        'foo',
        'it emits the `didDestroyMessage` hook'
      );
      done();
    }, testTimerDuration * 2);
  });

  test('it does not destroy the message if it is sticky', function (assert) {
    const done = assert.async();
    assert.expect(1);

    const stickyFlash = FlashMessage.create({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {},
      sticky: true,
    });

    later(() => {
      assert.false(stickyFlash.isDestroyed, 'it is not destroyed');
      done();
    }, testTimerDuration);
  });

  test('#destroyMessage deletes the message and timer', function (assert) {
    assert.expect(2);

    run(() => {
      flash.destroyMessage();
    });

    assert.true(flash.get('isDestroyed'));
    assert.notOk(flash.get('timer'));
  });

  test('it sets `exiting` to true after the timer has elapsed', function (assert) {
    assert.expect(2);
    const done = assert.async();

    const exitFlash = FlashMessage.create({
      timeout: testTimerDuration,
      extendedTimeout: testTimerDuration,
    });

    later(() => {
      assert.true(exitFlash.get('exiting'), 'it sets `exiting` to true');
      assert.notOk(exitFlash.get('timer'), 'it cancels the `timer`');
      done();
    }, testTimerDuration * 2);
  });

  test('it calls `onDestroy` when object is destroyed', function (assert) {
    assert.expect(1);

    const callbackFlash = FlashMessage.create({
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
