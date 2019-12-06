# Animated example

To animate messages, set `extendedTimeout` to something higher than zero. Here we've chosen 500ms.

{{#docs-snippet name='usage-6.js'}}
  module.exports = function(environment) {
    var ENV = {
      flashMessageDefaults: {
        extendedTimeout: 500
      }
    }
  }
{{/docs-snippet}}

Then animate using CSS transitions, using the `.active` and `.active.exiting` classes.

{{#docs-snippet name='usage-7.css' language="css"}}
  .alert {
    opacity: 0;
    position: relative;
    left: 100px;
    transition: all 700ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

    &.active {
      opacity: 1;
      left: 0px;

      &.exiting {
        opacity: 0;
        left: 100px;
      }
    }
  }
{{/docs-snippet}}
