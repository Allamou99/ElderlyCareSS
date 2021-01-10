import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
//pk.eyJ1Ijoic291ZmlhbmU5OSIsImEiOiJja2pxOGI0bHEzZTlhMnFvN2hzY2Y3cmpyIn0.MG2-oT7pfvYxtolBF_T1mA