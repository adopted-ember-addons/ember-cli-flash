import { typeOf } from '@ember/utils';
import { computed, get } from '@ember/object';
import { guidFor as emberGuidFor } from '@ember/object/internals';
import { A as emberArray } from '@ember/array';
import { isNone } from '@ember/utils';

export function add(...dependentKeys) {
  const computedFunc = computed({
    get() {
      const values = dependentKeys.map((dependentKey) => {
        const value = get(this, dependentKey);

        if (typeOf(value) !== 'number') {
          return;
        }

        return value;
      });

      return emberArray(values).compact().reduce((prev, curr) => {
        return prev + curr;
      });
    }
  });

  return computedFunc.property.apply(computedFunc, dependentKeys);
}

export function guidFor(dependentKey) {
  return computed(dependentKey, {
    get() {
      const value = get(this, dependentKey);

      // it's possible that a value has no toString as some objects don't implement the guid field
      // this early return it to avoid errors being thrown when calling undefined.toString()
      if (isNone(value)) return;

      return emberGuidFor(value.toString());
    }
  });
}
