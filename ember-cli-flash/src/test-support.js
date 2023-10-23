import FlashObject from './flash/object';

export function disableTimeout() {
  FlashObject.reopen({ disableTimeout: true });
}

export function enableTimeout() {
  FlashObject.reopen({ disableTimeout: false });
}
