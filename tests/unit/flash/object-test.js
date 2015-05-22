/* global sinon */
import { module, test } from 'qunit';
import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

const { forEach } = Ember.EnumerableUtils;

const testTimerDuration = 50;
const { run } = Ember;
let flash = null;
let SANDBOX = {};

module('FlashMessageObject', {
  beforeEach() {
    flash = FlashMessage.create({
      type: 'test',
      message: 'Cool story brah',
      timeout: testTimerDuration,
      service: {}
    });
  },

  afterEach() {
    flash = null;
    SANDBOX = {};
  }
});

test('#_destroyLater sets a timer', function(assert) {
  assert.ok(flash.get('timer'));
});

test('#_destroyLater destroys the message after the timer has elapsed', function(assert) {
  const done = assert.async();
  assert.expect(3);

  run.later(() => {
    assert.equal(flash.get('isDestroyed'), true);
    assert.equal(flash.get('timer'), null);
    done();
  }, testTimerDuration * 2);

  flash.one('destroyMessage', (isDestroyed) => {
    assert.equal(isDestroyed, true);
  });
});

test('#_destroyLater does not destroy the message if it is sticky', function(assert) {
  const done = assert.async();
  assert.expect(1);

  const stickyFlash = FlashMessage.create({
    type: 'test',
    message: 'Cool story brah',
    timeout: testTimerDuration,
    service: {},
    sticky: true
  });

  run.later(() => {
    assert.equal(stickyFlash.get('isDestroyed'), false);
    done();
  }, testTimerDuration);
});

test('#destroyMessage deletes the message and timer', function(assert) {
  assert.expect(2);

  run(() => {
    flash.destroyMessage();
  });

  assert.equal(flash.get('isDestroyed'), true);
  assert.equal(flash.get('timer'), null);
});

test('#is{type}Type aliases are read only', function(assert) {
  const typeAliases = [
    'isSuccessType',
    'isInfoType',
    'isWarningType',
    'isDangerType',
    'isErrorType'
  ];

  assert.expect(typeAliases.length);

  run(() => {
    forEach(typeAliases, (alias) => {
      assert.throws(() => {
        flash.set(alias, 'derp');
      });
    });
  });
});

test('#_destroyLater sets a exitingTimer when extendedTimeout is set', function(assert) {
  const exitFlash = FlashMessage.create({
    extendedTimeout: 1000
  });
  assert.ok(exitFlash.get('exitingTimer'));
});

test('#_destroyLater sets exiting after the timer has elapsed', function(assert) {
  const done = assert.async();
  const oneSecond = 1000;

  const exitFlash = FlashMessage.create({
    timeout: oneSecond,
    extendedTimeout: oneSecond
  });
  assert.expect(3);
  assert.equal(exitFlash.get('exiting'), false);

  run.later(() => {
    assert.equal(exitFlash.get('exiting'), true);
    assert.equal(exitFlash.get('exitingTimer'), null);
    done();
  }, oneSecond + 50);
});
