import FlashObject from './flash/object.ts';

export function disableTimeout() {
  FlashObject.isTimeoutDisabled = true;
}

export function enableTimeout() {
  FlashObject.isTimeoutDisabled = false;
}
