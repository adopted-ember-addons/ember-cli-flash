declare module 'ember-cli-flash/flash/object' {
  export default class FlashObject {
    message: string;
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
}
