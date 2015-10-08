import Ember from 'ember';
import config from '../../config/environment';
import {
  module,
  test,
  skip
} from 'qunit';
import startApp from '../helpers/start-app';
import Flash from 'ember-cli-flash/flash/object';

var application;
const { run } = Ember;
const { timeout: defaultTimeout } = config.flashMessageDefaults;

// const flashBackup = Flash.extend();

module('##Acceptance: Integration mouseover', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});



test('mouseover-ed messages are not removed automatically', function (assert) {

  let wasCanceled = false, wasRescheduled = false;
  let _destroyMessage, _cancel, prepareDestroy;
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
});
