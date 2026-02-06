import FlashObject from './flash/object.js';

function disableTimeout() {
  FlashObject.isTimeoutDisabled = true;
}
function enableTimeout() {
  FlashObject.isTimeoutDisabled = false;
}

export { disableTimeout, enableTimeout };
//# sourceMappingURL=test-support.js.map
