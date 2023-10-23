export default function objectWithout(originalObj = {}, keysToRemove = []) {
  let newObj = {};

  for (let key in originalObj) {
    if (keysToRemove.indexOf(key) === -1) {
      newObj[key] = originalObj[key];
    }
  }

  return newObj;
}
