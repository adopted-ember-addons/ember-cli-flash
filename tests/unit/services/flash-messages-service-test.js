import { module, test } from 'qunit';
import Ember from 'ember';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

var service;
var SANDBOX = {};
var run     = Ember.run;

module('FlashMessagesService', {
  beforeEach: function() {
    service = FlashMessagesService.create({});
    service.get('queue').clear();
  },

  afterEach: function() {
    service = null;
  }
});

test('#queue returns an array of flash messages', function(assert) {
  assert.expect(1);

  run(function() {
    service.success('success 1');
    service.success('success 2');
    service.success('success 3');
  });

  assert.equal(service.get('queue.length'), 3);
});

test('#arrangedQueue returns an array of flash messages, sorted by priority', function(assert) {
  assert.expect(2);

  run(function() {
    service.success('success 1', { priority: 100 });
    service.success('success 2', { priority: 200 });
    service.success('success 3', { priority: 300 });
  });

  assert.equal(service.get('arrangedQueue.length'), 3);
  assert.equal(service.get('arrangedQueue.0.priority'), 300);
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
    SANDBOX.flash = service.addMessage('custom', { type: 'test' });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#add adds a custom message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service.add({
      message: 'Test message please ignore',
      type: 'test'
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#_addToQueue adds a message to queue', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service._addToQueue({
      message : 'test',
      type    : 'test',
      timeout : 500
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#_newFlashMessage returns a new flash message', function(assert) {
  assert.expect(3);

  run(function() {
    SANDBOX.flash = service._newFlashMessage({
      message : 'test',
      type    : 'test',
      timeout : 500
    });
  });

  assert.ok(SANDBOX.flash);
  assert.equal(Ember.typeOf(SANDBOX.flash), 'instance');
  assert.equal(SANDBOX.flash.get('type'), 'test');
});
