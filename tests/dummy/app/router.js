import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('installation');
    this.route('compatibility');
    this.route('usage', function() {
      this.route('convenience');
      this.route('custom-messages');
      this.route('animated-example');
      this.route('arbitary-options');
      this.route('clearing-messages-on-screen');
      this.route('returning-flash-object');
    });

    this.route('service-defaults');
    this.route('displaying-flash-messages');

    this.route('testing', function() {
      this.route('acceptance-testing');
      this.route('unit-testing');
    });

    this.route('styling');
    this.route('license');

    this.route('demo');
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
