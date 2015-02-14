/* global sinon */
import Ember from 'ember';
import FlashMessage from 'ember-cli-flash/flash/object';
import {
  test,
  module
} from 'ember-qunit';

var testTimerDuration = 500;
var run               = Ember.run;
var flash             = null;
var SANDBOX           = {};

module('Flash Message Object', {
  beforeEach: function() {
    flash = FlashMessage.create({
      type    : 'test',
      message : 'Cool story brah',
      timeout : testTimerDuration,
      service : {}
    });
  },

  afterEach: function() {
    flash   = null;
    SANDBOX = {};
  }
});

test('#_destroyLater sets a timer', function(assert) {
  assert.ok(flash.get('timer'));
});

test('#_destroyLater destroys the message after the timer has elapsed', function(assert) {
  assert.expect(2);
  assert.stop();

  run.later(function() {
    assert.start();
    assert.equal(flash.get('isDestroyed'), true);
    assert.equal(flash.get('timer'), null);
  }, testTimerDuration * 2);
});

test('#destroyMessage deletes the message and timer', function(assert) {
  assert.expect(2);

  run(function() {
    flash.destroyMessage();
  });

  assert.equal(flash.get('isDestroyed'), true);
  assert.equal(flash.get('timer'), null);
});

