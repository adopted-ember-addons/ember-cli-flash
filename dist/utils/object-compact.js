import { isPresent } from '@ember/utils';

function objectCompact(objectInstance) {
  const compactedObject = {};
  for (let key in objectInstance) {
    const value = objectInstance[key];
    if (isPresent(value)) {
      compactedObject[key] = value;
    }
  }
  return compactedObject;
}

export { objectCompact as default };
//# sourceMappingURL=object-compact.js.map
