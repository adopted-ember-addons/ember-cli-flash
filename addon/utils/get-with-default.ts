import { get } from '@ember/object';

// This replicates Ember's deprecated `getWithDefault`.
// Note that, as in the original, `null` is considered a valid value and will
// not cause the function to return the default value.
type IndexType = string | number | symbol;

export default function getWithDefault(
  objectInstance: Record<IndexType, unknown>,
  key: IndexType,
  defaultValue: unknown
) {
  const value = get(objectInstance, key);

  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
