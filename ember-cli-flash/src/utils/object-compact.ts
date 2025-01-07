import { isPresent } from '@ember/utils';

export default function objectCompact(objectInstance: { [x: string]: any }) {
  const compactedObject: { [key: string]: any } = {};

  for (const key in objectInstance) {
    const value = objectInstance[key];

    if (isPresent(value)) {
      compactedObject[key] = value;
    }
  }

  return compactedObject;
}
