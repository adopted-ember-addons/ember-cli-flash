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
  assert.expect(8);
  visit('/');
  triggerEvent('.alert.alert-success', 'mouseenter');
  
  assert.ok(find('.alert.alert-success'), 'right after the rendering the flash message is there!');
  andThen(() => {
    assert.ok(find('.alert.alert-success'), 'the success message received the mouseenter and stayed on display');
    assert.equal(find('.alert').length, 2); //there should be the sticky and the mouseover-ed
    assert.equal(find('.alert.alert-success h6').text(), 'Success');
    assert.equal(find('.alert.alert-success p').text(), 'Route transitioned successfully');
  });
  triggerEvent('.alert.alert-success', 'mouseleave');
  andThen(() => {
    assert.equal(find('.alert').length, 1);//only the sicky one should be there now...
    assert.ok(find('.alert.alert-danger'));
    assert.equal(find('.alert.alert-danger h6').text(), 'Danger');
    assert.equal(find('.alert.alert-danger p').text(), 'You went offline');
  });
});