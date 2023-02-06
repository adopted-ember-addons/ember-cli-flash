type IndexType = string | number | symbol;

export default function objectWithout(originalObj: Record<IndexType, unknown> = {}, keysToRemove: IndexType[] = []) {
  const newObj = Object.create({});

  for (const key in originalObj) {
    if (keysToRemove.indexOf(key) === -1) {
      newObj[key] = originalObj[key];
    }
  }

  return newObj;
}
