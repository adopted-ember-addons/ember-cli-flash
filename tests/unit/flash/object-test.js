/* global sinon */
import { module, test } from 'qunit';
import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';

var testTimerDuration = 500;
var { run }           = Ember;
var flash             = null;
var SANDBOX           = {};

module('FlashMessageObject', {
  beforeEach() {
    flash = FlashMessage.create({
      type    : 'test',
      message : 'Cool story brah',
      timeout : testTimerDuration,
      service : {}
    });
  },

  afterEach() {
    flash   = null;
    SANDBOX = {};
  }
});

test('#_destroyLater sets a timer', function(assert) {
  assert.ok(flash.get('timer'));
});

test('#_destroyLater destroys the message after the timer has elapsed', function(assert) {
  const done = assert.async();
  assert.expect(2);

  run.later(() => {
    assert.equal(flash.get('isDestroyed'), true);
    assert.equal(flash.get('timer'), null);
    done();
  }, testTimerDuration * 2);
});

test('#destroyMessage deletes the message and timer', function(assert) {
  assert.expect(2);

  run(() => {
    flash.destroyMessage();
  });

  assert.equal(flash.get('isDestroyed'), true);
  assert.equal(flash.get('timer'), null);
});

