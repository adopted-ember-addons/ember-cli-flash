var EOL = require('os').EOL;

module.exports = {
  description: 'Generates ember-cli-flash test helper',

  afterInstall: function() {
    var TEST_HELPER_PATH = 'tests/test-helper.js';
    var IMPORT_STATEMENT = EOL + "import './helpers/flash-message';";
    var INSERT_AFTER = "import { start } from 'ember-qunit';";

    return this.insertIntoFile(TEST_HELPER_PATH, IMPORT_STATEMENT, { after: INSERT_AFTER });
  },

  normalizeEntityName: function() {}
};
