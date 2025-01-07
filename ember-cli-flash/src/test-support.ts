import FlashObject from './flash/object.ts';

export function disableTimeout() {
  FlashObject.prototype.testHelperDisableTimeout = true;
}

export function enableTimeout() {
  FlashObject.prototype.testHelperDisableTimeout = false;
}
