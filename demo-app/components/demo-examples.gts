import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { htmlSafe } from '@ember/template';

import type MyFlashMessagesService from '../services/flash-messages.ts';

export default class DemoExamples extends Component {
  @service declare flashMessages: MyFlashMessagesService;

  // Basic message types
  showSuccess = () => {
    this.flashMessages.success('Operation completed successfully!');
  };

  showInfo = () => {
    this.flashMessages.info('Here is some useful information.');
  };

  showWarning = () => {
    this.flashMessages.warning('Please review before continuing.');
  };

  showDanger = () => {
    this.flashMessages.danger('An error occurred!');
  };

  // With progress bar
  showWithProgress = () => {
    this.flashMessages.success('Saving your changes...', {
      showProgress: true,
      timeout: 5000,
    });
  };

  // Sticky message (won't auto-dismiss)
  showSticky = () => {
    this.flashMessages.info('This message will stay until you click it.', {
      sticky: true,
    });
  };

  // With extended timeout (exit animation)
  showWithExitAnimation = () => {
    this.flashMessages.success('Watch the exit animation!', {
      timeout: 3000,
      extendedTimeout: 2000,
      showProgress: true,
    });
  };

  // Priority demonstration
  showPriority = () => {
    this.flashMessages.info('Low priority (100)', { priority: 100 });
    this.flashMessages.warning('Medium priority (500)', { priority: 500 });
    this.flashMessages.danger('High priority (1000) - appears first!', {
      priority: 1000,
    });
  };

  // Custom timeout
  showCustomTimeout = (seconds: number) => {
    this.flashMessages.info(`This will disappear in ${seconds} seconds`, {
      timeout: seconds * 1000,
      showProgress: true,
    });
  };

  // Custom message type using add()
  showCustomType = () => {
    this.flashMessages.add({
      message: 'This is a custom "secondary" type message',
      type: 'secondary',
      timeout: 4000,
    });
  };

  // Custom fields with generics
  showWithCustomFields = () => {
    this.flashMessages.success('Message with custom fields', {
      id: 'unique-123',
      category: 'user',
      timeout: 8000,
      showProgress: true,
    });
  };

  // System notification (custom method)
  showSystemNotification = () => {
    this.flashMessages.systemNotification(
      'System maintenance scheduled for tonight',
    );
  };

  // Background task (custom method)
  showBackgroundTask = () => {
    this.flashMessages.backgroundTask(
      'Syncing data in background...',
      'sync-task-1',
    );
  };

  // Find and remove by custom field
  removeByCategory = () => {
    const removed = this.flashMessages.removeBy('category', 'system');

    if (!removed) {
      this.flashMessages.info('No system messages to remove');
    }
  };

  // Find message by ID
  findById = () => {
    const flash = this.flashMessages.findBy('id', 'unique-123');

    if (flash) {
      this.flashMessages.success(`Found message: "${String(flash.message)}"`);
    } else {
      this.flashMessages.warning(
        'No message with id "unique-123" found. Create one first!',
      );
    }
  };

  // Remove by ID
  removeById = () => {
    const removed = this.flashMessages.removeBy('id', 'sync-task-1');

    if (removed) {
      this.flashMessages.success('Removed sync task message');
    } else {
      this.flashMessages.warning('No message with id "sync-task-1" found');
    }
  };

  // HTML Safe message (supports markup)
  showHtmlSafe = () => {
    this.flashMessages.success(
      htmlSafe(
        '<strong>Bold!</strong> This message contains <em>HTML markup</em>.',
      ),
      { timeout: 5000 },
    );
  };

  // Prevent duplicates
  showPreventDuplicates = () => {
    this.flashMessages.info('This message can only appear once!', {
      preventDuplicates: true,
      timeout: 5000,
    });
  };

  // Non-dismissable on click (for interactive content)
  showNonDismissable = () => {
    this.flashMessages.info(
      "Click me - I won't close! Use the X button instead.",
      {
        destroyOnClick: false,
        sticky: true,
      },
    );
  };

  // Clear all messages
  clearAll = () => {
    this.flashMessages.clearMessages();
  };

  <template>
    {{! Basic Types }}
    <section class="example-section">
      <h3>📝 Basic Message Types</h3>
      <p class="text-muted small mb-3">
        Built-in types:
        <code>success</code>,
        <code>info</code>,
        <code>warning</code>,
        <code>danger</code>
      </p>
      <div class="btn-group-example">
        <button
          type="button"
          class="btn btn-success"
          {{on "click" this.showSuccess}}
        >
          Success
        </button>
        <button type="button" class="btn btn-info" {{on "click" this.showInfo}}>
          Info
        </button>
        <button
          type="button"
          class="btn btn-warning"
          {{on "click" this.showWarning}}
        >
          Warning
        </button>
        <button
          type="button"
          class="btn btn-danger"
          {{on "click" this.showDanger}}
        >
          Danger
        </button>
      </div>
      <pre><code>this.flashMessages.success('Operation completed!');</code></pre>
    </section>

    {{! Progress Bar }}
    <section class="example-section">
      <h3>⏳ Progress Bar</h3>
      <p class="text-muted small mb-3">
        Show a visual timer with
        <code>showProgress: true</code>
      </p>
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" this.showWithProgress}}
      >
        Show with Progress
      </button>
      <pre><code>this.flashMessages.success('Saving...', { showProgress: true,
          timeout: 5000, });</code></pre>
    </section>

    {{! Sticky Messages }}
    <section class="example-section">
      <h3>📌 Sticky Messages</h3>
      <p class="text-muted small mb-3">
        Messages that stay until dismissed with
        <code>sticky: true</code>
      </p>
      <button
        type="button"
        class="btn btn-secondary"
        {{on "click" this.showSticky}}
      >
        Show Sticky Message
      </button>
      <pre><code>this.flashMessages.info('Click to dismiss', { sticky: true, });</code></pre>
    </section>

    {{! Exit Animation }}
    <section class="example-section">
      <h3>✨ Exit Animation</h3>
      <p class="text-muted small mb-3">
        Use
        <code>extendedTimeout</code>
        to add an
        <code>.exiting</code>
        class before removal
      </p>
      <button
        type="button"
        class="btn btn-outline-primary"
        {{on "click" this.showWithExitAnimation}}
      >
        Show with Exit Animation
      </button>
      <pre><code>this.flashMessages.success('Watch the exit!', { timeout: 3000,
          extendedTimeout: 2000, // adds 'exiting' class });</code></pre>
    </section>

    {{! Priority }}
    <section class="example-section">
      <h3>🔢 Priority Sorting</h3>
      <p class="text-muted small mb-3">
        Higher priority messages appear first in
        <code>arrangedQueue</code>
      </p>
      <button
        type="button"
        class="btn btn-dark"
        {{on "click" this.showPriority}}
      >
        Show Priority Demo
      </button>
      <pre><code>this.flashMessages.danger('Important!', { priority: 1000 });
          this.flashMessages.info('Less important', { priority: 100 });</code></pre>
    </section>

    {{! Custom Timeout }}
    <section class="example-section">
      <h3>⏱️ Custom Timeout</h3>
      <p class="text-muted small mb-3">
        Set how long messages stay visible
      </p>
      <div class="btn-group-example">
        <button
          type="button"
          class="btn btn-outline-secondary"
          {{on "click" (fn this.showCustomTimeout 2)}}
        >
          2 seconds
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          {{on "click" (fn this.showCustomTimeout 5)}}
        >
          5 seconds
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          {{on "click" (fn this.showCustomTimeout 10)}}
        >
          10 seconds
        </button>
      </div>
    </section>

    {{! Custom Types }}
    <section class="example-section">
      <h3>🎨 Custom Message Types</h3>
      <p class="text-muted small mb-3">
        Use
        <code>add()</code>
        with any Bootstrap alert type or your own custom types
      </p>
      <button
        type="button"
        class="btn btn-secondary"
        {{on "click" this.showCustomType}}
      >
        Show Secondary Type
      </button>
      <pre><code>this.flashMessages.add({ message: 'Custom type message', type:
          'secondary', timeout: 4000, });</code></pre>
    </section>

    {{! TypeScript Generics }}
    <section class="example-section">
      <h3>🔷 TypeScript Generics</h3>
      <p class="text-muted small mb-3">
        Pass custom fields with full type safety using generics
      </p>
      <div class="btn-group-example">
        <button
          type="button"
          class="btn btn-primary"
          {{on "click" this.showWithCustomFields}}
        >
          With Custom Fields
        </button>
        <button
          type="button"
          class="btn btn-info"
          {{on "click" this.showSystemNotification}}
        >
          System Notification
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          {{on "click" this.showBackgroundTask}}
        >
          Background Task
        </button>
      </div>
      <pre><code>// Define custom fields interface interface CustomFlashFields {
          id?: string; category?: 'system' | 'user' | 'background'; } // Extend
          service with generics class MyFlashMessages extends
          FlashMessagesService&lt;CustomFlashFields&gt; {} // Use custom fields
          this.flashMessages.success('Message', { id: 'unique-123', category:
          'user', });</code></pre>
    </section>

    {{! findBy and removeBy }}
    <section class="example-section">
      <h3>🔍 findBy &amp; removeBy</h3>
      <p class="text-muted small mb-3">
        Find or remove messages by any field (including custom fields)
      </p>
      <div class="btn-group-example">
        <button
          type="button"
          class="btn btn-outline-primary"
          {{on "click" this.findById}}
        >
          Find by ID
        </button>
        <button
          type="button"
          class="btn btn-outline-danger"
          {{on "click" this.removeById}}
        >
          Remove by ID
        </button>
        <button
          type="button"
          class="btn btn-outline-warning"
          {{on "click" this.removeByCategory}}
        >
          Remove System Messages
        </button>
      </div>
      <pre><code>// Find a message by any field const flash =
          this.flashMessages.findBy('id', 'unique-123'); // Remove by any field
          (returns boolean) this.flashMessages.removeBy('category', 'system');</code></pre>
    </section>

    {{! HTML Safe Messages }}
    <section class="example-section">
      <h3>🔒 HTML Safe Messages</h3>
      <p class="text-muted small mb-3">
        Use
        <code>htmlSafe()</code>
        to include HTML markup in messages
      </p>
      <button
        type="button"
        class="btn btn-success"
        {{on "click" this.showHtmlSafe}}
      >
        Show HTML Message
      </button>
      <pre><code>import { htmlSafe } from '@ember/template';
          this.flashMessages.success(
          htmlSafe('&lt;strong&gt;Bold!&lt;/strong&gt; with
          &lt;em&gt;markup&lt;/em&gt;') );</code></pre>
    </section>

    {{! Prevent Duplicates }}
    <section class="example-section">
      <h3>🚫 Prevent Duplicates</h3>
      <p class="text-muted small mb-3">
        Click multiple times - only one message will appear!
      </p>
      <button
        type="button"
        class="btn btn-info"
        {{on "click" this.showPreventDuplicates}}
      >
        Show (Try Clicking Multiple Times)
      </button>
      <pre><code>this.flashMessages.info('Unique message', { preventDuplicates:
          true, });</code></pre>
    </section>

    {{! Non-dismissable on Click }}
    <section class="example-section">
      <h3>🖱️ Disable Click to Dismiss</h3>
      <p class="text-muted small mb-3">
        Messages that don't close when clicked (for interactive content)
      </p>
      <button
        type="button"
        class="btn btn-warning"
        {{on "click" this.showNonDismissable}}
      >
        Show Non-Dismissable
      </button>
      <pre><code>this.flashMessages.info('Click won\'t close me', {
          destroyOnClick: false, sticky: true, });</code></pre>
    </section>

    {{! Clear All }}
    <section class="example-section">
      <h3>🧹 Clear All Messages</h3>
      <p class="text-muted small mb-3">
        Remove all messages at once
      </p>
      <button
        type="button"
        class="btn btn-outline-danger"
        {{on "click" this.clearAll}}
      >
        Clear All
      </button>
      <pre><code>this.flashMessages.clearMessages();</code></pre>
    </section>
  </template>
}
