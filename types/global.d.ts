import 'ember-cached-decorator-polyfill';

// Types for compiled templates
declare module 'ember-cli-flash/templates/*' {
  // @ts-ignore todo: remove after ember-cli-htmlbars has proper types
  import { TemplateFactory } from 'ember-cli-htmlbars';

  const tmpl: TemplateFactory;
  export default tmpl;
}
