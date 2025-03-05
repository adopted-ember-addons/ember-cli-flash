function flashMessageOptions (configOverrides) {
  const addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    preventDuplicates: false
  };
  return Object.assign(addonDefaults, configOverrides);
}

export { flashMessageOptions as default };
//# sourceMappingURL=flash-message-options.js.map
