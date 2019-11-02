import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log('Know how to code and want to use it to change the world? Please contact us at contact@connect-tocare.org. We love meeting new people!');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
