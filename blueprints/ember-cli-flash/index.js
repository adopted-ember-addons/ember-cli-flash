var EOL = require('os').EOL;

module.exports = {
  description: 'Generates ember-cli-flash test helper',

  afterInstall() {
    const TEST_HELPER_PATH = 'tests/test-helper.js';
    const IMPORT_STATEMENT = EOL + "import './helpers/flash-message';";
    const INSERT_AFTER = "import { start } from 'ember-qunit';";

    return this.insertIntoFile(TEST_HELPER_PATH, IMPORT_STATEMENT, {
      after: INSERT_AFTER,
    });
  },

  normalizeEntityName() {},
};
