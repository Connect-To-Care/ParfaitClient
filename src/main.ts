import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  console.log('Detected production environment');
  enableProdMode();
}

// tslint:disable-next-line:max-line-length
console.log('Be careful! This is a feature designed for debugging websites. If someone told you to copy/paste content in here, that\'s bad!');
console.log('A simplyalec Website. alec@simplyalec.com');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
