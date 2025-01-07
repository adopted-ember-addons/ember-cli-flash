import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import {
  click,
  find,
  render,
  rerender,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import { on } from '@ember/modifier';
import { FlashMessage, FlashMessageObject } from 'ember-cli-flash';
import { next, later } from '@ember/runloop';
import { isDestroyed } from '@ember/destroyable';

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
    await rerender();

    assert.dom('*').hasText('hello', 'updated message is displayed');
  });

  test('it renders with the right props', async function (assert) {
    assert.expect(3);

    const flash = new FlashMessageObject({
      message: 'test',
      type: 'test',
      timeout: TIMEOUT,
      extendedTimeout: 5000,
      showProgress: true,
    });

    // NOTE: This is a hack to get the progress bar to render in the test
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    render(<template><FlashMessage @flash={{flash}} /></template>);

    // eslint-disable-next-line ember/no-runloop
    later(
      this,
      () => {
        assert.dom('.alert').hasClass('alert-test');
        assert.strictEqual(
          (find('.alert-progress-bar') as HTMLElement)?.style[
            'transitionDuration'
          ],
          '50ms',
          'it has the right `progressDuration`',
        );
      },
      TIMEOUT - 20,
    ); // Checking for the DOM in between 0 - 50 ms :facepalm: When support for Ember 2.x is dropped, this can be moved as a `next` instead of later.

    await settled();

    assert
      .dom('.alert')
      .hasClass('active', 'it sets `active` to true after rendering');
  });

  test('it does not error when quickly removed from the DOM', async function (assert) {
    const flash = new FlashMessageObject({ message: 'hi', sticky: true });
    let flag = true;

    await render(
      <template>
        {{#if flag}}
          <FlashMessage @flash={{flash}} as |component flash|>
            {{flash.message}}
          </FlashMessage>
        {{/if}}
      </template>,
    );

    flag = false;

    await settled();
    assert.ok(isDestroyed(flash), 'Flash Object isDestroyed');
  });

  test('flash message is removed after timeout', async function (assert) {
    assert.expect(3);

    const flash = new FlashMessageObject({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash|>
          {{flash.message}}
        </FlashMessage>
      </template>,
    );

    // eslint-disable-next-line ember/no-runloop
    later(
      this,
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
    assert.expect(3);

    const flashObject = new FlashMessageObject({
      message: 'hi',
      sticky: false,
      timeout: timeoutDefault,
    });

    const flash = flashObject;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    render(
      <template>
        <FlashMessage id="testFlash" @flash={{flash}} as |component flash|>
          {{flash.message}}
        </FlashMessage>
      </template>,
    );

    // eslint-disable-next-line ember/no-runloop
    later(
      this,
      () => {
        assert.dom('*').hasText('hi');
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        triggerEvent('#testFlash', 'mouseenter');

        // eslint-disable-next-line ember/no-runloop
        next(this, () => {
          assert.notOk(
            isDestroyed(flashObject),
            'Flash Object is not destroyed',
          );

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          triggerEvent('#testFlash', 'mouseleave');
        });
      },
      timeoutDefault - 100,
    );

    await settled();

    assert.ok(isDestroyed(flashObject), 'Flash Object is destroyed');
  });

  test('a custom component can use the close closure action', async function (assert) {
    assert.expect(3);

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
    assert.expect(2);

    const flashObject = new FlashMessageObject({
      message: 'flash message content',
      sticky: true,
      extendedTimeout: 100,
    });

    const flash = flashObject;

    await render(
      <template>
        <FlashMessage @flash={{flash}} as |component flash|>
          <span>{{flash.message}}</span>
        </FlashMessage>
      </template>,
    );

    await click('.alert');
    assert.dom('.alert').hasClass('exiting', 'exiting class is applied');
    assert.ok(isDestroyed(flashObject), 'Flash Object is destroyed');
  });

  test('custom message type class name prefix is applied', async function (assert) {
    assert.expect(2);
    const flashObject = new FlashMessageObject({
      message: 'flash message content',
      type: 'test',
      sticky: true,
    });

    const flash = flashObject;
    const messageStylePrefix = 'my-flash-';

    await render(
      <template>
        <FlashMessage
          @flash={{flash}}
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
