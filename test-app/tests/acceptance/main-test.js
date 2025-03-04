import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import config from '../../config/environment';

const { timeout: defaultTimeout } = config.flashMessageDefaults;

module('Acceptance | main', function (hooks) {
  setupApplicationTest(hooks);

  test('flash messages are rendered', async function (assert) {
    await visit('/');

    assert.dom('.alert.alert-success').exists();
    assert.dom('.alert.alert-success h6').hasText('Success');
    assert
      .dom('.alert.alert-success p')
      .hasText('Route transitioned successfully');
    assert
      .dom('.alert.alert-success .alert-progressBar')
      .hasAttribute('style', `transition-duration: ${defaultTimeout}ms`);

    assert.dom('.alert.alert-warning').exists();
    assert.dom('.alert.alert-warning h6').hasText('Warning');
    assert
      .dom('.alert.alert-warning p')
      .hasText('It is going to rain tomorrow');
  });

  test('high priority messages are rendered on top', async function (assert) {
    await visit('/');

    assert.dom('.alert').exists();
    assert.dom('.alert h6').hasText('Warning');
    assert.dom('.alert p').hasText('It is going to rain tomorrow');
  });
});
