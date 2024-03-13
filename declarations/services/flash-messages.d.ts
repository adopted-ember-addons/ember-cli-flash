declare module 'ember-cli-flash/services/flash-messages' {
  import Service from '@ember/service';
  import FlashObject from 'ember-cli-flash/flash/object';

  export interface MessageOptions {
    type: string;
    priority: number;
    timeout: number;
    sticky: boolean;
    showProgress: boolean;
    extendedTimeout: number;
    destroyOnClick: boolean;
    onDestroy: () => void;
    [key: string]: unknown;
  }

  export interface CustomMessageInfo extends Partial<MessageOptions> {
    message: string;
  }

  export interface FlashFunction {
    (message: string, options?: Partial<MessageOptions>): FlashMessageService;
  }

  class FlashMessageService extends Service {
    queue: FlashObject[];
    readonly arrangedQueue: FlashObject[];
    readonly isEmpty: boolean;
    success: FlashFunction;
    warning: FlashFunction;
    info: FlashFunction;
    danger: FlashFunction;
    alert: FlashFunction;
    secondary: FlashFunction;
    add(messageInfo: CustomMessageInfo): this;
    clearMessages(): this;
    registerTypes(types: string[]): this;
    getFlashObject(): FlashObject;
    peekFirst(): FlashObject | undefined;
    peekLast(): FlashObject | undefined;
    readonly flashMessageDefaults: any;
  }

  export default FlashMessageService;
}
