export default function objectWithout(originalObj = {}, keysToRemain = []) {
  const newObj = {};

  for (let key in originalObj) {
    if (keysToRemain.indexOf(key) !== -1) {
      newObj[key] = originalObj[key];
    }
  }

  return newObj;
}
