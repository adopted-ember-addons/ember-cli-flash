import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';

import type MyFlashMessagesService from '../services/flash-messages.ts';

export default class QueueSidebar extends Component {
  @service declare flashMessages: MyFlashMessagesService;

  clearAll = () => {
    this.flashMessages.clearMessages();
  };

  <template>
    <div class="queue-sidebar">
      <div class="queue-panel bg-dark text-light">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">📊 Current Queue</h5>
          <button
            type="button"
            class="btn btn-outline-light btn-sm py-0 px-2"
            disabled={{unless this.flashMessages.queue.length true}}
            {{on "click" this.clearAll}}
          >
            Clear
          </button>
        </div>
        <p class="text-muted small mb-3">
          <code class="text-light">queue.length</code>:
          {{this.flashMessages.queue.length}}
        </p>
        {{#if this.flashMessages.queue.length}}
          <ul class="list-unstyled mb-0">
            {{#each this.flashMessages.queue as |flash|}}
              <li class="mb-2 small">
                <span class="badge bg-{{flash.type}} me-1">{{flash.type}}</span>
                <span class="queue-message-text">
                  {{flash.message}}
                </span>
                {{#if flash.id}}
                  <br />
                  <small class="text-muted">
                    id:
                    <code>{{flash.id}}</code>
                    {{#if flash.category}}
                      ·
                      <code>{{flash.category}}</code>
                    {{/if}}
                  </small>
                {{/if}}
              </li>
            {{/each}}
          </ul>
        {{else}}
          <p class="text-light mb-0 fst-italic small opacity-50">
            No messages in queue
          </p>
        {{/if}}
      </div>
    </div>
  </template>
}
