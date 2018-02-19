var EOL = require('os').EOL;
let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  description: 'Generates ember-cli-flash test helper',

  afterInstall: function() {
    var TEST_HELPER_PATH = 'tests/test-helper.js';
    var IMPORT_STATEMENT = EOL + "import './helpers/flash-message';";
    var INSERT_AFTER_PRE_2_17 = "import resolver from './helpers/resolver';";
    var INSERT_AFTER_POST_2_17 = "import { start } from 'ember-qunit';";

    let checker = new VersionChecker(this);
    let ember = checker.forEmber();

    let after;
    if (ember.isAbove('2.17.0')) {
      after = INSERT_AFTER_POST_2_17;
    } else {
      after = INSERT_AFTER_PRE_2_17;
    }

    return this.insertIntoFile(TEST_HELPER_PATH, IMPORT_STATEMENT, { after });
  },

  normalizeEntityName: function() {}
};
