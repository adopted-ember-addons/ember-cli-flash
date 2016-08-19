/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '~1.13.0'
        },
        resolutions: {
          'ember': '~1.13.0'
        }
      }
    },
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          'ember': '~2.0.0'
        },
        resolutions: {
          'ember': '~2.0.0'
        }
      }
    },
    {
      name: 'ember-lts',
      bower: {
        dependencies: {
          "ember": "~2.4.0"
        }
      }
    },
    {
      name: 'ember-latest',
      bower: {
        dependencies: {
          "ember": "release"
        },
        resolutions: {
          "ember": "release"
        }
      }
    },
    {
      name: 'ember-beta',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "beta"
        },
        resolutions: {
          "ember": "beta"
        }
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "canary"
        },
        resolutions: {
          "ember": "canary"
        }
      }
    },
    {
      name: 'ember-alpha',
      allowedToFail: true,
      bower: {
        dependencies: {
          "ember": "alpha"
        },
        resolutions: {
          "ember": "alpha"
        }
      }
    }
  ]
};
