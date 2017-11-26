import { test } from 'qunit';
import config from '../../config/environment';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

const { timeout: defaultTimeout } = config.flashMessageDefaults;

moduleForAcceptance('Acceptance | main');

test('flash messages are rendered', async function(assert) {
  assert.expect(7);
  await visit('/');

  assert.ok(find('.alert.alert-success'));
  assert.equal(find('.alert.alert-success h6').text(), 'Success');
  assert.equal(find('.alert.alert-success p').text(), 'Route transitioned successfully');
  assert.equal(find('.alert.alert-success .alert-progressBar').attr('style'), `transition-duration: ${defaultTimeout}ms`);

  assert.ok(find('.alert.alert-warning'));
  assert.equal(find('.alert.alert-warning h6').text(), 'Warning');
  assert.equal(find('.alert.alert-warning p').text(), 'It is going to rain tomorrow');
});

test('high priority messages are rendered on top', async function(assert) {
  assert.expect(3);
  await visit('/');

  assert.ok(find('.alert'));
  assert.equal(find('.alert h6').first().text(), 'Warning');
  assert.equal(find('.alert p').first().text(), 'It is going to rain tomorrow');
});
