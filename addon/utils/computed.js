import { computed, get } from '@ember/object';
import { guidFor as emberGuidFor } from '@ember/object/internals';
import { isNone } from '@ember/utils';

export function guidFor(dependentKey) {
  return computed(dependentKey, {
    get() {
      const value = get(this, dependentKey);

      // it's possible that a value has no toString as some objects don't implement the guid field
      // this early return it to avoid errors being thrown when calling undefined.toString()
      if (isNone(value)) return;

      return emberGuidFor(value.toString());
    },
  });
}
