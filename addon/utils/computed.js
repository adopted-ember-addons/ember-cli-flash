import Ember from 'ember';
import computed from 'ember-new-computed';

const {
  typeOf,
  get,
  guidFor: emberGuidFor,
  A: emberArray
} = Ember;

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

      return emberGuidFor(value.toString());
    }
  });
}
