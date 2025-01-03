export default function objectWithout(
  originalObj: { [key: string]: any } = {},
  keysToRemove: string[] = [],
) {
  const newObj: { [key: string]: any } = {};

  for (const key in originalObj) {
    if (keysToRemove.indexOf(key) === -1) {
      newObj[key] = originalObj[key];
    }
  }

  return newObj;
}
