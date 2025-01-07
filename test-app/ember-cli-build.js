'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');
const { Webpack } = require('@embroider/webpack');
const sideWatch = require('@embroider/broccoli-side-watch');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    trees: {
      app: sideWatch('app', { watching: ['../ember-cli-flash'] }),
    },

    'ember-cli-babel': { enableTypeScriptTransform: true },
  });

  return compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
