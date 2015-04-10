import { module, test } from 'qunit';
import Ember from 'ember';
import config from '../../../config/environment';
import FlashMessagesService from 'ember-cli-flash/services/flash-messages-service';

const { run }      = Ember;
const { classify } = Ember.String;
const { forEach }  = Ember.EnumerableUtils;

let service;
let SANDBOX = {};

module('FlashMessagesService', {
  beforeEach() {
    service = FlashMessagesService.create({
      flashMessageDefaults: config.flashMessageDefaults
    });
  },

  afterEach() {
    run(() => {
      service.get('queue').clear();
      service.destroy();
    });

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

test('#arrangedQueue is read only', function(assert) {
  assert.expect(2);

  run(() => {
    service.success('foo');
    assert.throws(() => {
      service.set('arrangedQueue', []);
    });
  });

  assert.equal(service.get('arrangedQueue.length'), 1);
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
    service._registerTypes(['foo', 'bar']);
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
  const expectLength   = defaultTypes.length * 2;

  assert.expect(expectLength);

  forEach(defaultTypes, (type) => {
    const method = service[type];

    assert.ok(method);
    assert.equal(Ember.typeOf(method), 'function');
  });
});

test("passing applications specific options via add()", function(assert) {
  run(() => {
    SANDBOX.flash = service.add({
      message   : "here's an option you may or may not know",
      appOption : 'ohai'
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.appOption'), 'ohai');
});

test("passing application specific options via specific message type", function(assert) {
  run(() => {
    SANDBOX.flash = service.info('you can pass app options this way too', {
      appOption: 'we meet again app-option'
    });
  });

  assert.equal(service.get('queue.length'), 1);
  assert.equal(service.get('queue.0'), SANDBOX.flash);
  assert.equal(service.get('queue.0.appOption'), 'we meet again app-option');
});

test('#_setDefaults sets the correct defaults for service properties', function(assert) {
  const flashMessageDefaults = config.flashMessageDefaults;
  const configOptions        = Ember.keys(flashMessageDefaults);
  const expectLength           = configOptions.length;

  assert.expect(expectLength);

  forEach(configOptions, (option) => {
    const classifiedKey = `default${classify(option)}`;
    const defaultValue  = service[classifiedKey];
    const configValue   = flashMessageDefaults[option];

    assert.equal(defaultValue, configValue);
  });
});
