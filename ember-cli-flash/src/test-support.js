import FlashObject from './flash/object';

const originalInit = FlashObject.prototype.init;
const noopInit = () => {};

export function disableTimers() {
  FlashObject.reopen({ init: noopInit });
}

export function enableTimers() {
  FlashObject.reopen({ init: originalInit });
}
