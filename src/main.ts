import { enableProdMode, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then((module) => { 
  let applicationRef = module.injector.get(ApplicationRef); 
  let rootComponentRef = applicationRef.components[0];  
  console.log(rootComponentRef.componentType.name);  
}).catch(err => console.error(err));
