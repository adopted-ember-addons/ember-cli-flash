/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'img-src': '*',
      'connect-src': '*',
      'font-src': '*',
      'script-src': '\'unsafe-inline\' *',
      'style-src': '\'unsafe-inline\' *'
    },
    flashMessageDefaults: {
      timeout: 1,
      extendedTimeout: 0,
      priority: 100,
      sticky: true,
      showProgress: false,
      type: 'info',
      types: [
        'success',
        'info',
        'warning',
        'danger',
        'alert',
        'secondary',
        'foo'
      ],
      injectionFactories: [
        'route',
        'controller',
        'view',
        'component'
      ],
      preventDuplicates: false
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/ember-cli-flash';
  }

  return ENV;
};
