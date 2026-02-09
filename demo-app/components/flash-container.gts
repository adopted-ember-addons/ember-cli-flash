import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

import FlashMessage from '#src/components/flash-message.gts';

import type MyFlashMessagesService from '../services/flash-messages.ts';

export default class FlashContainer extends Component {
  @service declare flashMessages: MyFlashMessagesService;

  <template>
    <div class="flash-container">
      {{#each this.flashMessages.arrangedQueue as |flash|}}
        <FlashMessage @flash={{flash}} as |component flashData close|>
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>{{component.flashType}}</strong>
              {{#if flashData.category}}
                <span class="badge bg-secondary ms-2">
                  {{flashData.category}}
                </span>
              {{/if}}
              <p class="mb-0 mt-1">
                {{flashData.message}}
              </p>
              {{#if flashData.id}}
                <small class="text-muted">ID: {{flashData.id}}</small>
              {{/if}}
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              {{on "click" close}}
            ></button>
          </div>
          {{#if component.showProgressBar}}
            <div class="alert-progress">
              <div
                class="alert-progress-bar"
                style={{component.progressDuration}}
              ></div>
            </div>
          {{/if}}
        </FlashMessage>
      {{/each}}
    </div>
  </template>
}
