import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { OrderComponent } from './order/order.component';
import { BuildorderComponent } from './order/buildorder.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IdentityRevealedValidatorDirective } from './login/password.validator';
import { MsgdialogComponent } from './dialogs/msgdialog.component';
import { MatDialogModule} from '@angular/material/dialog';
import { DeletedialogComponent } from './dialogs/deletedialog.component';


/**
 * @author: lyi
 * 08/2020
 */
@NgModule({
  declarations: [
    AppComponent,
    QuoteComponent,
    OrderComponent,
    BuildorderComponent,
    LoginComponent,
    HomeComponent,
    IdentityRevealedValidatorDirective,
    MsgdialogComponent,
    DeletedialogComponent
  ],
  imports: [
    HttpClientModule, 
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule, //dialog use
    HttpClientJsonpModule
  ],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // for Dialog Material
})
export class AppModule { }
