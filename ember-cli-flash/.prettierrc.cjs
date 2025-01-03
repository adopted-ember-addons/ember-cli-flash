'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  templateSingleQuote: false,
  overrides: [
    {
      files: '*.{js,ts,cjs,mjs,gjs,gts}',
      options: {
        singleQuote: true,
      },
    },
  ],
};
