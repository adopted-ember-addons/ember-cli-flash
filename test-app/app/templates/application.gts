import RouteTemplate from 'ember-route-template';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { pageTitle } from 'ember-page-title';
import { FlashMessage } from 'ember-cli-flash';
import { CodeBlock } from 'ember-shiki';

import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

class ApplicationRoute extends Component {
  @service declare readonly flashMessages: FlashMessagesService;

  snippet = `
  import { FlashMessage } from 'ember-cli-flash';

  <template>
    {{#each this.flashMessages.arrangedQueue as |flash|}}
      <FlashMessage @flash={{flash}} as |component flash|>
        <h6>
          {{component.flashType}}
        </h6>
        <p>
          {{flash.message}}
        </p>
        {{#if component.showProgressBar}}
          <div class="alert-progress">
            <div
              class="alert-progress-bar"
              style={{component.progressDuration}}
            >
            </div>
          </div>
        {{/if}}
      </FlashMessage>
    {{/each}}
  </template>`;

  <template>
    {{pageTitle "Ember-CLI-Flash Demo"}}

    <h1 id="title">
      Ember-CLI-Flash Demo
    </h1>

    <p>
      Simple, highly configurable flash messages for ember-cli.
    </p>

    {{#each this.flashMessages.arrangedQueue as |flash|}}
      <FlashMessage @flash={{flash}} as |component flash|>
        <h6>
          {{component.flashType}}
        </h6>

        <p>
          {{flash.message}}
        </p>

        {{#if component.showProgressBar}}
          <div class="alert-progress">
            <div
              class="alert-progress-bar"
              style={{component.progressDuration}}
            >
            </div>
          </div>
        {{/if}}
      </FlashMessage>
    {{/each}}

    <CodeBlock @code={{this.snippet}} @language="gjs" />
  </template>
}

export default RouteTemplate(ApplicationRoute);
