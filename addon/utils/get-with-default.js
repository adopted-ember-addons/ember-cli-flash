import { get } from '@ember/object';

export default function getWithDefault(objectInstance, key, defaultValue) {
  let value = get(objectInstance, key);

  if (value === undefined || value === null) {
    return defaultValue;
  }

  return value;
}
