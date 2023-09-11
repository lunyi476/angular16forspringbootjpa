import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuoteComponent } from './quote/quote.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { BuildorderComponent } from './order/buildorder.component';

const routes: Routes = [                     
                        {path: '', redirectTo: '/home', pathMatch: 'full' },
                        {path: 'home', component: HomeComponent },
                        {path: 'login', component: LoginComponent},
                        {path: 'quote', component: QuoteComponent},
                        {path: 'order', component: OrderComponent},
                        {path: 'buildorder', component: BuildorderComponent}
                       ];


/**
 * @author: lyi
 * 08/2020
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
