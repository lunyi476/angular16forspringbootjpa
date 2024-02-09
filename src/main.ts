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

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { withInterceptorsFromDi, provideHttpClient, HttpClientJsonpModule, withJsonpSupport } from '@angular/common/http';
import { routesApp }  from './app/app-routing';
import { provideRouter } from '@angular/router';



bootstrapApplication(AppComponent, { 
    providers: [
        provideRouter(routesApp),
        // BrowserModule exported CommonModule
        // Message Service class (which is neither directive not component and cannot import module) uses services in MatDialogModule which has to be in root
        // Without MatDialogModule, at run time, MessageService will throw error (compiling is ok)
        importProvidersFrom( BrowserModule, MatDialogModule),  // , HttpClientJsonpModule 
        provideHttpClient(withInterceptorsFromDi()),   // , withJsonpSupport()
        provideAnimations()
    ]
}).then ( (module) => { 
  window['rootInjector'] = module.injector;
} ).catch( err => console.error(err));
