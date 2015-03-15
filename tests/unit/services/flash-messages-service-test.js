import { module, test } from 'qunit';
import Ember from 'ember';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

var service;
var SANDBOX = {};
var { run } = Ember;

module('FlashMessagesService', {
  beforeEach() {
    service = FlashMessagesService.create({});
    service.get('queue').clear();
  },

  afterEach() {
    service = null;
    SANDBOX = {};
  }
});

test('#queue returns an array of flash messages', function(assert) {
  assert.expect(1);

  run(() => {
    service.success('success 1');
    service.success('success 2');
    service.success('success 3');
  });

  assert.equal(service.get('queue.length'), 3);
});

test('#arrangedQueue returns an array of flash messages, sorted by priority', function(assert) {
  assert.expect(2);

  run(() => {
    service.success('success 1', { priority: 100 });
    service.success('success 2', { priority: 200 });
    service.success('success 3', { priority: 300 });
  });

  assert.equal(service.get('arrangedQueue.length'), 3);
  assert.equal(service.get('arrangedQueue.0.priority'), 300);
});

test('#add adds a custom message', function(assert) {
  assert.expect(3);

  run(() => {
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

  run(() => {
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

  run(() => {
    SANDBOX.flash = service._newFlashMessage({
      message  : 'test',
      type     : 'test',
      timeout  : 500,
      priority : 500
    });
  });

  assert.ok(SANDBOX.flash);
  assert.equal(Ember.typeOf(SANDBOX.flash), 'instance');
  assert.equal(SANDBOX.flash.get('type'), 'test');
});

test('#registerType registers a new type', function(assert) {
  assert.expect(5);

  run(() => {
    service.registerType('test');
    SANDBOX.type  = service.test;
    SANDBOX.flash = service.test('foo');
  });

  assert.ok(SANDBOX.type);
  assert.ok(SANDBOX.flash);
  assert.equal(Ember.typeOf(SANDBOX.type), 'function');
  assert.equal(Ember.typeOf(SANDBOX.flash), 'instance');
  assert.equal(SANDBOX.flash.get('type'), 'test');
});

test('#_registerTypes registers new types', function(assert) {
  assert.expect(4);

  run(() => {
    service.registerType('foo');
    service.registerType('bar');
    SANDBOX.type1 = service.foo;
    SANDBOX.type2 = service.bar;
  });

  assert.ok(SANDBOX.type1);
  assert.ok(SANDBOX.type2);
  assert.equal(Ember.typeOf(SANDBOX.type1), 'function');
  assert.equal(Ember.typeOf(SANDBOX.type2), 'function');
});

test('#_initTypes registers default types on init', function(assert) {
  const defaultTypes = [ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ];
  let expectLength   = defaultTypes.length * 2;

  assert.expect(expectLength);

  defaultTypes.forEach((type) => {
    let method = service[type];

    assert.ok(method);
    assert.equal(Ember.typeOf(method), 'function');
  });
});
