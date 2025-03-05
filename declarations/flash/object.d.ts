declare module 'ember-cli-flash/flash/object' {
  import { CustomMessageInfo } from 'ember-cli-flash/services/flash-messages';

  export default class FlashObject {
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

  export type FlashObjectWithOptions = FlashObject & CustomMessageInfo;
}
