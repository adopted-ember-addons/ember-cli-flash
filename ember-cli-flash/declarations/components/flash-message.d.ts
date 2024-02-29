declare module 'ember-cli-flash/components/flash-message' {
  import Component from '@glimmer/component';
  import FlashObject from 'ember-cli-flash/flash/object';

  export default class FlashMessage extends Component<{
    Args: {
      flash: FlashObject;
      messageStyle?: 'bootstrap' | 'foundation';
      messageStylePrefix?: string;
    };
    Blocks: {
      default: [FlashMessage, FlashObject, () => void];
    };
    Element: HTMLDivElement;
  }> {}
}
