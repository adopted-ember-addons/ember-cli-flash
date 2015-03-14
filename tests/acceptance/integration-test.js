import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

var application;
const { run } = Ember;

module('Acceptance: Integration', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('flash messages are rendered', function(assert) {
  assert.expect(6);
  visit('/');

  assert.ok(find('.alert.alert-success'));
  assert.equal(find('.alert.alert-success h6').text(), 'success');
  assert.equal(find('.alert.alert-success p').text(), 'Route transitioned successfully');

  assert.ok(find('.alert.alert-warning'));
  assert.equal(find('.alert.alert-warning h6').text(), 'warning');
  assert.equal(find('.alert.alert-warning p').text(), 'It is going to rain tomorrow');
});

test('high priority messages are rendered on top', function(assert) {
  assert.expect(3);
  visit('/');

  assert.ok(find('.alert'));
  assert.equal(find('.alert h6').first().text(), 'warning');
  assert.equal(find('.alert p').first().text(), 'It is going to rain tomorrow');
});

test('sticky messages are not removed automatically', function(assert) {
  assert.expect(4);
  visit('/');

  andThen(() => {
    assert.ok(find('.alert.alert-danger'));
    assert.equal(find('.alert').length, 1);
    assert.equal(find('.alert.alert-danger h6').text(), 'danger');
    assert.equal(find('.alert.alert-danger p').text(), 'You went offline');
  });
});
