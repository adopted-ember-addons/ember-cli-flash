declare module 'ember-cli-flash/flash/object' {
  import EmberObject from '@ember/object';
  import Evented from '@ember/object/evented';

  class FlashObject extends EmberObject.extend(Evented) {
    exiting: boolean;
    exitTimer: number;
    isExitable: boolean;
    initializedTime: number;
    destroyMessage(): void;
    exitMessage(): void;
    preventExit(): void;
    allowExit(): void;
    timerTask(): void;
    exitTimerTask(): void;
  }
  export default FlashObject;
}
