/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-flash',

  setupPreprocessorRegistry: function(type, registry) {
    var options = getOptions(this.parent && this.parent.options && this.parent.options['babel']);

    var plugin = {
      name   : 'ember-cli-babel',
      ext    : 'js',
      toTree : function(tree) {
        return require('broccoli-babel-transpiler')(tree, options);
      }
    };

    registry.add('js', plugin);
  },

  config: function(environment /*, appConfig*/) {
    var ENV = {
      flashMessageDefaults: {
        timeout      : 3000,
        priority     : 100,
        sticky       : false,
        showProgress : false,
        type         : 'info',
        types        : [ 'success', 'info', 'warning', 'danger', 'alert', 'secondary' ]
      }
    };

    return ENV;
  },

  included: function(app) {
    this._super.included(app);
    app.import('vendor/flash-message/style.css');
  }
};

// https://github.com/babel/ember-cli-babel/blob/master/index.js
function getOptions(options) {
  options = options || {};

  // Ensure modules aren't compiled unless explicitly set to compile
  options.blacklist = options.blacklist || ['es6.modules'];

  if (options.compileModules === true) {
    if (options.blacklist.indexOf('es6.modules') >= 0) {
      options.blacklist.splice(options.blacklist.indexOf('es6.modules'), 1);
    }

    delete options.compileModules;
  } else {
    if (options.blacklist.indexOf('es6.modules') < 0) {
      options.blacklist.push('es6.modules');
    }
  }

  // Ember-CLI inserts its own 'use strict' directive
  options.blacklist.push('useStrict');

  return options;
}
