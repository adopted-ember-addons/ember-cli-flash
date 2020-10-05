import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { module, test } from 'qunit';
import FlashMessage from 'ember-cli-flash/flash/object';

const testTimerDuration = 50;
let flash = null;

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

    run.later(() => {
      assert.equal(
        flash.isDestroyed,
        true,
        'it sets `isDestroyed` to true'
      );
      assert.equal(flash.timer, null, 'it cancels the timer');
      assert.equal(result, 'foo', 'it emits the `didDestroyMessage` hook');
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

    run.later(() => {
      assert.equal(
        stickyFlash.isDestroyed,
        false,
        'it is not destroyed'
      );
      done();
    }, testTimerDuration);
  });

  test('#destroyMessage deletes the message and timer', function (assert) {
    assert.expect(2);

    run(() => {
      flash.destroyMessage();
    });

    assert.equal(flash.get('isDestroyed'), true);
    assert.equal(flash.get('timer'), null);
  });

  test('it sets `exiting` to true after the timer has elapsed', function (assert) {
    assert.expect(2);
    const done = assert.async();

    const exitFlash = FlashMessage.create({
      timeout: testTimerDuration,
      extendedTimeout: testTimerDuration,
    });

    run.later(() => {
      assert.equal(exitFlash.get('exiting'), true, 'it sets `exiting` to true');
      assert.equal(exitFlash.get('timer'), null, 'it cancels the `timer`');
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
