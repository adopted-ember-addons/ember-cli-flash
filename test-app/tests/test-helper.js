import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { enableTimeout } from 'ember-cli-flash/test-support';

enableTimeout();

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
