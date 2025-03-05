import FlashObject from './flash/object.js';

function disableTimeout() {
  FlashObject.prototype.testHelperDisableTimeout = true;
}
function enableTimeout() {
  FlashObject.prototype.testHelperDisableTimeout = false;
}

export { disableTimeout, enableTimeout };
//# sourceMappingURL=test-support.js.map
