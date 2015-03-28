import { module, test } from 'qunit';
import Ember from 'ember';
import config from '../../../config/environment';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

var service;
var SANDBOX = {};
var { run } = Ember;

module('FlashMessagesService', {
  beforeEach() {
    service = FlashMessagesService.create({});
    service.get('queue').clear();
    service.set('defaultTimeout', 1);
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

test('#addMessage adds a custom message', function(assert) {
  assert.expect(3);

  run(() => {
    SANDBOX.flash = service.addMessage('Yo ho ho and a bottle of rum', {
      type: 'test'
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#add adds a custom message', function(assert) {
  assert.expect(3);

  run(() => {
    SANDBOX.flash = service.add({
      message : 'Test message please ignore',
      type    : 'test'
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
});

test('#_addToQueue adds a message to queue', function(assert) {
  assert.expect(6);

  run(() => {
    SANDBOX.flash = service._addToQueue({
      message      : 'test',
      type         : 'test',
      timeout      : 1,
      sticky       : true,
      showProgress : true
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.type'), 'test');
  assert.equal(service.get('queue.0.timeout'), 1);
  assert.equal(service.get('queue.0.sticky'), true);
  assert.equal(service.get('queue.0.showProgress'), true);
});

test('#_newFlashMessage returns a new flash message', function(assert) {
  assert.expect(3);

  run(() => {
    SANDBOX.flash = service._newFlashMessage({
      message  : 'test',
      type     : 'test',
      timeout  : 1,
      priority : 500
    });
  });

  assert.ok(SANDBOX.flash);
  assert.equal(Ember.typeOf(SANDBOX.flash), 'instance');
  assert.equal(SANDBOX.flash.get('type'), 'test');
});

test('#_registerType registers a new type', function(assert) {
  assert.expect(5);

  run(() => {
    service._registerType('test');
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

test('#_setDefaults sets the correct defaults for service properties', function(assert) {
  service = FlashMessagesService.create({});

  const flashMessageDefaults = config.flashMessageDefaults;

  const defaultOptions = Object.keys(flashMessageDefaults);
  const expectLength   = defaultOptions.length;

  assert.expect(expectLength);

  defaultOptions.forEach((defaultOption) => {
    const classifiedKey       = `default${defaultOption.classify()}`;
    const isServiceKeyDefined = !!service[classifiedKey];
    const isConfigKeyDefined  = !!flashMessageDefaults[defaultOption];

    assert.equal(isServiceKeyDefined, isConfigKeyDefined);
  });
});
