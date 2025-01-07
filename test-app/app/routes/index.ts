import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';

export default class IndexRoute extends Route {
  @service declare readonly flashMessages: FlashMessagesService;

  activate() {
    const flashMessages = this.flashMessages;

    flashMessages.success('Route transitioned successfully', {
      priority: 500,
      showProgress: true,
    });

    flashMessages.success('Three second timout with a two second exit', {
      priority: 100,
      showProgress: true,
      sticky: false,
      timeout: 3000,
      extendedTimeout: 2000,
    });

    flashMessages.warning('It is going to rain tomorrow', {
      priority: 1000,
      extendedTimeout: 1000,
    });

    flashMessages.danger('You went offline');
  }
}
