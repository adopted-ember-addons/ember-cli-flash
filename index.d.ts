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

declare module 'ember-cli-flash/services/flash-messages' {

  import Service from '@ember/service';
  import FlashObject from 'ember-cli-flash/flash/object';

  interface MessageOptions {
    type: string;
    priority: number;
    timeout: number;
    sticky: boolean;
    showProgress: boolean;
    extendedTimeout: number;
    destroyOnClick: boolean;
    onDestroy: () => void;
  }
  
  interface CustomMessageInfo extends Partial<MessageOptions> {
    message: string;
  }
  
  interface FlashFunction {
    (message: string, options?: Partial<MessageOptions>): FlashMessageService;
  }
  
  class FlashMessageService extends Service {
    success: FlashFunction;
    warning: FlashFunction;
    info: FlashFunction;
    danger: FlashFunction;
    alert: FlashFunction;
    secondary: FlashFunction;
    add(messageInfo: CustomMessageInfo): FlashMessageService;
    clearMessages(): FlashMessageService;
    registerTypes(types: string[]): FlashMessageService;
    getFlashObject(): FlashObject;
  }

  export default FlashMessageService;
}
