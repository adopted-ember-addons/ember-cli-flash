/* jshint node:true */

'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    flashMessageDefaults: {
      timeout: 3000,
      extendedTimeout: 0,
      priority: 100,
      sticky: false,
      showProgress: false,
      type: 'info',
      types: [
        'success',
        'info',
        'warning',
        'danger',
        'alert',
        'secondary'
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
};
