import { pageTitle } from 'ember-page-title';

import DemoExamples from '../components/demo-examples.gts';
import FlashContainer from '../components/flash-container.gts';
import QueueSidebar from '../components/queue-sidebar.gts';

<template>
  {{pageTitle "ember-cli-flash Demo"}}

  {{! Main content }}
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-8 col-xl-9">
        <header class="mb-5">
          <h1 class="display-4">🔔 ember-cli-flash</h1>
          <p class="lead text-muted">
            Simple, highly configurable flash messages for Ember.js
          </p>
          <a
            href="https://github.com/adopted-ember-addons/ember-cli-flash"
            class="btn btn-outline-secondary btn-sm"
          >
            View on GitHub →
          </a>
        </header>

        <DemoExamples />
      </div>

      {{! Sticky Queue Sidebar }}
      <div class="col-lg-4 col-xl-3 sidebar-column">
        <QueueSidebar />
        <FlashContainer />
      </div>
    </div>
  </div>
</template>
