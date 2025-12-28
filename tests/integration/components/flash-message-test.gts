import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  render,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import { next, later } from '@ember/runloop';
import { isDestroyed } from '@ember/destroyable';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

import FlashMessageObject from '#src/flash/object.ts';
import FlashMessage from '#src/components/flash-message.gts';

const timeoutDefault = 1000;
const TIMEOUT = 50;

module('Integration | Component | flash message', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a flash message', async function (assert) {
    const flash = new FlashMessageObject({ message: 'hi', sticky: true });

    await render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash|>
          {{flash.message}}
        </FlashMessage>
      </template>,
    );

    assert.dom('*').hasText('hi', 'initial message is displayed');

    flash.message = 'hello';

    await settled();

    assert.dom('*').hasText('hello', 'updated message is displayed');
  });

  test('it renders with the right props', async function (assert) {
    const flash = new FlashMessageObject({
      message: 'test',
      type: 'test',
      timeout: TIMEOUT,
      extendedTimeout: 5000,
      showProgress: true,
      sticky: true,
    });

    void render(<template><FlashMessage @flash={{flash}} /></template>);

    // eslint-disable-next-line ember/no-runloop
    later(
      this as unknown as object,
      () => {
        assert
          .dom('.alert')
          .hasClass('alert-test', 'correct type class applied');

        const progressBar = find('.alert-progress-bar');
        assert.ok(progressBar, 'progress bar element exists');

        if (progressBar) {
          const duration = (progressBar as HTMLElement).style
            .transitionDuration;
          assert.strictEqual(
            duration,
            '50ms',
            `it has the right progressDuration (got: ${duration})`,
          );
        }
      },
      TIMEOUT - 20,
    );

    await settled();

    assert
      .dom('.alert')
      .hasClass('active', 'it sets `active` to true after rendering');
  });

  test('it does not error when quickly removed from the DOM', async function (assert) {
    const flash = new FlashMessageObject({ message: 'hi', sticky: true });

    class State {
      @tracked flag = true;
    }

    const state = new State();

    await render(
      <template>
        {{#if state.flag}}
          <FlashMessage @flash={{flash}} as |component flash|>
            {{flash.message}}
          </FlashMessage>
        {{/if}}
      </template>,
    );

    state.flag = false;

    await settled();

    assert.ok(isDestroyed(flash), 'Flash Object isDestroyed');
  });

  test('flash message is removed after timeout', async function (assert) {
    const flash = new FlashMessageObject({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
    });

    void render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash|>
          {{flash.message}}
        </FlashMessage>
      </template>,
    );

    // eslint-disable-next-line ember/no-runloop
    later(
      this as unknown as object,
      () => {
        assert.dom('*').hasText('hi');
        assert.notOk(isDestroyed(flash), 'Flash is not destroyed immediately');
      },
      timeoutDefault - 100,
    );

    await settled();

    assert.ok(isDestroyed(flash), 'Flash Object is destroyed');
  });

  test('flash message is removed after timeout if mouse enters', async function (assert) {
    const flash = new FlashMessageObject({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
    });

    void render(
      <template>
        <FlashMessage id="testFlash" @flash={{flash}} as |component flash|>
          {{flash.message}}
        </FlashMessage>
      </template>,
    );

    // eslint-disable-next-line ember/no-runloop
    later(
      this as unknown as object,
      () => {
        assert.dom('*').hasText('hi');
        void triggerEvent('#testFlash', 'mouseenter');

        // eslint-disable-next-line ember/no-runloop
        next(this as unknown as object, () => {
          assert.notOk(isDestroyed(flash), 'Flash Object is not destroyed');
          void triggerEvent('#testFlash', 'mouseleave');
        });
      },
      timeoutDefault - 100,
    );

    await settled();

    assert.ok(isDestroyed(flash), 'Flash Object is destroyed');
  });

  test('a custom component can use the close closure action', async function (assert) {
    const flash = new FlashMessageObject({
      message: 'flash message content',
      sticky: true,
      destroyOnClick: false,
    });

    await render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash close|>
          {{flash.message}}
          <a href="#" {{on "click" close}}>close</a>
        </FlashMessage>
      </template>,
    );

    assert.notOk(isDestroyed(flash), 'flash has not been destroyed yet');

    await click('.alert');

    assert.notOk(isDestroyed(flash), 'flash has not been destroyed yet');

    await click('.alert a');

    assert.ok(isDestroyed(flash), 'flash is destroyed after clicking close');
  });

  test('exiting class is applied for sticky messages', async function (assert) {
    const flash = new FlashMessageObject({
      message: 'flash message content',
      sticky: true,
      extendedTimeout: 100,
    });

    await render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash|>
          <span>{{flash.message}}</span>
        </FlashMessage>
      </template>,
    );

    await click('.alert');
    assert.dom('.alert').hasClass('exiting', 'exiting class is applied');
    assert.ok(isDestroyed(flash), 'Flash Object is destroyed');
  });

  test('custom message type class name prefix is applied', async function (assert) {
    const flashM = new FlashMessageObject({
      message: 'flash message content',
      type: 'test',
      sticky: true,
    });

    const messageStylePrefix = 'my-flash-';

    await render(
      <template>
        <FlashMessage
          @flash={{flashM}}
          @messageStylePrefix={{messageStylePrefix}}
          as |component flash|
        >
          <span>{{flash.message}}</span>
        </FlashMessage>
      </template>,
    );

    assert
      .dom('.my-flash-test')
      .exists(
        { count: 1 },
        'it uses the provided flash type class name prefix',
      );
    assert
      .dom('.my-flash-test')
      .doesNotHaveClass(
        'alert',
        'default flash type class name is not present',
      );
  });
});
