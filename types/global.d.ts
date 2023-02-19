import 'ember-cached-decorator-polyfill';
import 'ember-cli-htmlbars';

// Types for compiled templates
declare module 'ember-cli-flash/templates/*' {
  import type { TemplateFactory } from 'ember-cli-htmlbars';

  const tmpl: TemplateFactory;
  export default tmpl;
}
