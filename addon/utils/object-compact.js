import Ember from 'ember';

const {
  isPresent
} = Ember;

export default function objectCompact(objectInstance) {
  const compactedObject = {};

  for (let key in objectInstance) {
    const value = objectInstance[key];

    if (isPresent(value)) {
      compactedObject[key] = value;
    }
  }

  return compactedObject;
}
