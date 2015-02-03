import Ember from 'ember';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';
import {
  test
} from 'ember-qunit';

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

test('#success adds a success message', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service.success('success');
  });

  equal(service.get('queue.length'), 1);
  equal(service.get('queue.0'), SANDBOX.flash);
  equal(service.get('queue.0.type'), 'success');
});

test('#info adds a info message', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service.info('info');
  });

  equal(service.get('queue.length'), 1);
  equal(service.get('queue.0'), SANDBOX.flash);
  equal(service.get('queue.0.type'), 'info');
});

test('#warning adds a warning message', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service.warning('warning');
  });

  equal(service.get('queue.length'), 1);
  equal(service.get('queue.0'), SANDBOX.flash);
  equal(service.get('queue.0.type'), 'warning');
});

test('#addMessage adds a custom message', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service.addMessage('custom', 'test');
  });

  equal(service.get('queue.length'), 1);
  equal(service.get('queue.0'), SANDBOX.flash);
  equal(service.get('queue.0.type'), 'test');
});

test('#_addToQueue adds a message to queue', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service._addToQueue('test', 'test', 500);
  });

  equal(service.get('queue.length'), 1);
  equal(service.get('queue.0'), SANDBOX.flash);
  equal(service.get('queue.0.type'), 'test');
});

test('#_newFlashMessage returns a new flash message', function() {
  expect(3);

  run(function() {
    SANDBOX.flash = service._newFlashMessage(service, 'test', 'test', 500);
  });

  ok(SANDBOX.flash);
  equal(Ember.typeOf(SANDBOX.flash), 'instance');
  equal(SANDBOX.flash.get('type'), 'test');
});
