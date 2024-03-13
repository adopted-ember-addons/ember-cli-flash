function objectWithout(originalObj = {}, keysToRemain = []) {
  let newObj = {};
  for (let key in originalObj) {
    if (keysToRemain.indexOf(key) !== -1) {
      newObj[key] = originalObj[key];
    }
  }
  return newObj;
}

export { objectWithout as default };
//# sourceMappingURL=object-only.js.map
