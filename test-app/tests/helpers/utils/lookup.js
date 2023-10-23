export function lookupService(application, serviceName) {
  return application.__container__.lookup(`service:${serviceName}`);
}

export function lookupComponent(application, componentName) {
  return application.__container__.lookup(`component:${componentName}`);
}
