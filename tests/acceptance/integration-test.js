import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';
import Flash from 'ember-cli-flash/flash/object';

var application;
const { run } = Ember;

const flashBackup = Flash.extend();

module('Acceptance: Integration', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('flash messages are rendered', function(assert) {
  assert.expect(7);
  visit('/');

  assert.ok(find('.alert.alert-success'));
  assert.equal(find('.alert.alert-success h6').text(), 'Success');
  assert.equal(find('.alert.alert-success p').text(), 'Route transitioned successfully');
  assert.equal(find('.alert.alert-success .alert-progressBar').attr('style'), 'transition-duration: 50ms');

  assert.ok(find('.alert.alert-warning'));
  assert.equal(find('.alert.alert-warning h6').text(), 'Warning');
  assert.equal(find('.alert.alert-warning p').text(), 'It is going to rain tomorrow');
});

test('high priority messages are rendered on top', function(assert) {
  assert.expect(3);
  visit('/');

  assert.ok(find('.alert'));
  assert.equal(find('.alert h6').first().text(), 'Warning');
  assert.equal(find('.alert p').first().text(), 'It is going to rain tomorrow');
});

test('sticky messages are not removed automatically', function(assert) {
  assert.expect(4);
  visit('/');

  andThen(() => {
    assert.ok(find('.alert.alert-danger'));
    assert.equal(find('.alert').length, 1);
    assert.equal(find('.alert.alert-danger h6').text(), 'Danger');
    assert.equal(find('.alert.alert-danger p').text(), 'You went offline');
  });
});
test('sticky messages are still removed when clicked', function(assert) {
  assert.expect(5);

  visit('/');

  andThen(() => {
    assert.ok(find('.alert.alert-danger'));
    assert.equal(find('.alert').length, 1);
    assert.equal(find('.alert.alert-danger h6').text(), 'Danger');
    assert.equal(find('.alert.alert-danger p').text(), 'You went offline');
  });

  // click('.alert.alert-danger');
  triggerEvent('.alert.alert-danger', $(document), 'click');
  andThen(() => {
    assert.equal(find('.alert').length, 0);
  });
});

test('mouseover-ed messages are not removed automatically', function (assert) {

  let wasCanceled = false, wasRescheduled = false;
  let _destroyMessage, _cancel, prepareDestroy;
  Flash.reopen({
    __destroyMessage: Flash._destroyMessage,
    __cancel: Flash._cancel,
    _prepareDestroy: Flash.prepareDestroy
  });
  Flash.reopen({
    _destroyMessage() {
      //do not acctually destroy them!
      //just do nothing;
    },
    _cancel() {
      //this method should only be called by the mouseover-ed message
      //aka the success message
      assert.ok(this.get('isSuccessType'), 'the success message was mouseovered and its destruction has been canceled!');
      assert.equal(wasRescheduled, false, 'this destruction should not be rescheduled just yet');
      //to make sure of the tests order:
      wasCanceled = true;
    },
    prepareDestroy() {
      //should be called when the mouseover is over.
      assert.ok(wasCanceled, 'the cancel method should have been called previously');
      assert.ok(this.get('isSuccessType'), 'again, the rescheduling of the flash destruction should only occure for the success message');
      wasRescheduled = true;
    }
  });
  assert.expect(6);
  visit('/');
  triggerEvent('.alert.alert-success', 'mouseenter');

  andThen(() => {
    assert.ok(wasCanceled, 'at this point the flash destruction should have been canceled');
  });
  triggerEvent('.alert.alert-success', 'mouseleave');
  andThen(() => {
    assert.ok(wasRescheduled, 'at this point the flash destruction should have been rescheduled');
  });
  Flash.reopen({
    _destroyMessage: function () {
      this.__destroyMessage();
    },
    _cancel: function () { this.__cancel(); },
    prepareDestroy: function () { this._prepareDestroy(); }
  });
  // Flash.reopen(flashBackup.create());
});
