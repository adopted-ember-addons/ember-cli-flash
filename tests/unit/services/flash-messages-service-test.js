import QUnit from 'qunit';
import Ember from 'ember';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';
import {
  test
} from 'ember-qunit';

var service;
var SANDBOX = {};
var run     = Ember.run;

QUnit.module('FlashMessagesService', {
  beforeEach: function() {
    service = FlashMessagesService.create({});
    service.get('queue').clear();
  },

  afterEach: function() {
    service = null;
  }
});

test('#success adds a success message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service.success('success');
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'success');
});

test('#info adds a info message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service.info('info');
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'info');
});

test('#warning adds a warning message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service.warning('warning');
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'warning');
});

test('#addMessage adds a custom message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service.addMessage('custom', 'test');
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#_addToQueue adds a message to queue', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service._addToQueue('test', 'test', 500);
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#_newFlashMessage returns a new flash message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service._newFlashMessage(service, 'test', 'test', 500);
  });

  assert.ok(SANDBOX.flash);
  assert.equal(Ember.typeOf(SANDBOX.flash), 'instance');
  assert.equal(SANDBOX.flash.get('type'), 'test');
});
