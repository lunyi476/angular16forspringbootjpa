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

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { withInterceptorsFromDi, provideHttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { routesApp }  from './app/app-routing';
import { provideRouter } from '@angular/router';



bootstrapApplication(AppComponent, { // bootstrap Component (starting/root component)
    providers: [
        provideRouter(routesApp),
        // BrowserModule exported CommonModule
        // Message Service class (which is neither directive not component and cannot import module) uses MatDialogModule which has to be in root
        importProvidersFrom( BrowserModule, MatDialogModule, HttpClientJsonpModule),   
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
}).then ( (module) => { 
  window['rootInjector'] = module.injector;
} ).catch( err => console.error(err));
