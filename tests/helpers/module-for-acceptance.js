import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        options.beforeEach.call(this, ...arguments);
      }
    },

    afterEach() {
      destroyApp(this.application);

      if (options.afterEach) {
        options.afterEach.call(this, ...arguments);
      }
    }
  });
}
