/* import { enableProdMode } from '@angular/core';
const ApplicationRef = import ('@angular/core');
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then((module) => { 
  const applicationRef = module.injector.get(ApplicationRef); 
  const rootComponentRef = applicationRef.components[0];  
  console.log(rootComponentRef.componentType.name);  
}).catch(err => console.error(err)); */


import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
