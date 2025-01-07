export default function objectWithout(
  originalObj: { [key: string]: any } = {},
  keysToRemain: string[] = [],
) {
  const newObj: { [key: string]: any } = {};

  for (const key in originalObj) {
    if (keysToRemain.indexOf(key) !== -1) {
      newObj[key] = originalObj[key];
    }
  }

  return newObj;
}
