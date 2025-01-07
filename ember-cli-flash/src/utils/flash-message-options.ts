import type { MessageOptions } from '../flash/object.ts';

export default function (configOverrides: MessageOptions) {
  const addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    preventDuplicates: false,
  };
  return Object.assign(addonDefaults, configOverrides);
}
