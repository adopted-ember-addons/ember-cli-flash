import { find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import config from '../../config/environment';

const { timeout: defaultTimeout } = config.flashMessageDefaults;

module('Acceptance | main', function(hooks) {
  setupApplicationTest(hooks);

  test('flash messages are rendered', async function(assert) {
    assert.expect(7);
    await visit('/');

    assert.ok(find('.alert.alert-success'));
    assert.equal(find('.alert.alert-success h6').textContent, 'Success');
    assert.equal(find('.alert.alert-success p').textContent, 'Route transitioned successfully');
    assert.equal(find('.alert.alert-success .alert-progressBar').getAttribute('style'), `transition-duration: ${defaultTimeout}ms`);

    assert.ok(find('.alert.alert-warning'));
    assert.equal(find('.alert.alert-warning h6').textContent, 'Warning');
    assert.equal(find('.alert.alert-warning p').textContent, 'It is going to rain tomorrow');
  });

  test('high priority messages are rendered on top', async function(assert) {
    assert.expect(3);
    await visit('/');

    assert.ok(find('.alert'));
    assert.equal(find('.alert h6').textContent, 'Warning');
    assert.equal(find('.alert p').textContent, 'It is going to rain tomorrow');
  });
});
