import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { ViewChild,  Component, ChangeDetectionStrategy,  ChangeDetectorRef, ViewContainerRef, ElementRef} from '@angular/core'; 
import { NavbarService } from './navbar.service';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { QuoteComponent } from './quote/quote.component';
import { HttptoserverService} from './httptoserver.service';
import { Quotes } from './quotes';
import { MessageService} from './message.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Orders } from './orders';
import { OrderComponent } from './order/order.component';
import { DeletedialogComponent } from './dialogs/deletedialog.component';
import { deletemsgqt, deletemsgod } from './dialogs/msg-dialog-data';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgClass, NgSwitchDefault } from '@angular/common';

/**
 * regarding LView and TView:
 * https://angularindepth.com/posts/1512/change-detection-and-component-trees-in-angular-applications
 * 
 * 
 * @author: lyi
 * 08/2020
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./app.component.css'],
    standalone: true,
    //providers: [{provide: NavbarService, useClass: NavbarService}],  //provided already in root
    //template dependencies., for HTML template compiling and loading, not for class code part
    imports: [ ReactiveFormsModule, NgFor, NgIf, NgSwitch, NgSwitchCase, NgClass, NgSwitchDefault, RouterLink, RouterOutlet]
})
export class AppComponent  {
    title = 'springbootjpaangular8';
    // All menus for current screen
    links = new Array<{ text: string, path: string }> ();
    // indicator of logged or not
    isLoggedIn: number=0; 
    // for select disable state
    disabled: number =0; 
    /** Selection of Order or Quote. template form two way binding, 
     * must add <form> tag in html template
     */
    selectControl: FormGroup;
    selectedQtNo : string ='';
    selectedOdNo: string ='';
    allQuotes : Quotes[];
    allOrders : Orders[];
    // Release memory of Observable
    unsubscribes =[] as Subscription[];
    // For call task of components from menu, all menus located in appComp
    currentQt : QuoteComponent;
    currentOd : OrderComponent;
    // For retrieve active componennt instance from router directive
    @ViewChild("objRouterOutlet", { static: true }) routerOutlet: RouterOutlet;
    // Dynamic create fields and assign value to this fields during creating Component
    // it is better way to do it staticlly in class compiling time
    constructor(private router: Router, public navbarService: NavbarService,  
      private httpService : HttptoserverService, private msgService: MessageService, 
      // ChangeDetectorRef and  ViewContainerRef does not depends on other injector so no need to be @Injectable and providers
      public changeDetector: ChangeDetectorRef, private _vcr: ViewContainerRef     
       ) { 

        }
       
    //Listening routeroutlet
    onActivate() : void {
      setTimeout(() => {// MacroTask after Tasks in Stack and MicroTasks were completed
        if (this.routerOutlet.component instanceof QuoteComponent) {
          this.currentQt = <QuoteComponent>this.routerOutlet.component ;    
        }
        if (this.routerOutlet.component instanceof OrderComponent) {
          this.currentOd = <OrderComponent>this.routerOutlet.component ;     
        }
      })
    }

    ngOnInit() {
      if (this.isLoggedIn == 0) {
        this.router.navigate(['home']);
      }
      // listening router events
      let subRouterEvent = this.router.events.subscribe(
        (event) => {
            if (event instanceof NavigationStart) {
              if(event.url == "/quote") {             
                this.navbarService.updateMenu("quote");    
                this.httpService.getQuotes().subscribe (
                  next => { 
                    this.allQuotes = next; 
                    this.changeDetector.detectChanges();                                               
                  }, 
                  error => this.msgService.openDialog(error.error)
                )
                 
              }
              if(event.url == "/order") {             
                this.navbarService.updateMenu("order");    
                this.httpService.getOrders().subscribe (
                  next => { 
                    this.allOrders = next; 
                    this.changeDetector.detectChanges();                                               
                  }, 
                  error => this.msgService.openDialog(error.error)
                )
                 
              }
              else if (event.url =="/home") {
                // clear select
                this.allQuotes =[];
                this.navbarService.updateMenu("home");  
                // Back to initial status
                this.objectSelect.setValue("selected");           
              }
            }
    
            if (event instanceof NavigationEnd) {
            }
        });
      
      this.links = this.navbarService.getMenus();
      // subscribe will receive change automatically, isLoggedIn change will change menu view
      let subNav = this.navbarService.getLogStatus().subscribe(
        status => this.isLoggedIn = status);

      this.selectControl = new FormGroup ( {});
      this.selectControl.addControl('objectSelect', new  FormControl (  'selected'));
      this.unsubscribes.push(subRouterEvent);
      this.unsubscribes.push(subNav);
      

    }

    get objectSelect () {
      return this.selectControl.get('objectSelect');
    }
  
    logout() {
      this.isLoggedIn =0;
      // clear select
      this.allQuotes =[];
      this.objectSelect.setValue("selected");
      this.router.navigate(['home']);
    }

    getQuotes(): void {
      this.httpService.getQuotes()
        .subscribe(
          qts=> this.allQuotes = qts
        );
    }

    addOffer () : boolean {   
      this.currentQt.addOfferGroup();
      return false;
    }

    selectedQuote (): boolean{ 
      let reqNo = this.objectSelect.value;
      this.currentQt.selectedQuote(Number.parseInt(reqNo));
      return true;
    }

    newQuote () : boolean { 
      this.currentQt.newQuote();
      // reset to initial status
      this.objectSelect.setValue("selected");
      return true;
    }

    saveQuote () : boolean {  
      // pass alQuotes and FormControl for reset after updaet/save succed 
      this.currentQt.saveQuote(this.allQuotes, this.objectSelect);
      return true;
    }

    deleteQuote () : boolean { 
      if (!this.currentQt || !this.currentQt.quote)
        return true;

      let dialog = this.msgService.openDelDialog('');
      
      dialog.open(DeletedialogComponent,  {
        panelClass: 'dialog-panel',
        data: { message: deletemsgqt}
      }).afterClosed().subscribe(res => {  
        if (res) {
         this.currentQt.deleteQuote(this.allQuotes, this.objectSelect);
        }
     })
      return true;
    }

    // For Order
    getOrders(): void {
      this.httpService.getOrders()
        .subscribe(
          ord=> this.allOrders = ord
        );
    }

    getOrderComp () : OrderComponent {
      return this.currentOd;
    }

    selectedOrder (): boolean{ 
      let ordNo = this.objectSelect.value;
      this.currentOd.selectedOrder(Number.parseInt(ordNo), this.allOrders);
      return true;
    }

    buildOrder () : boolean { 
      // reset to initial status
      this.objectSelect.setValue("selected");
      this.disabled =1;
      this.selectControl.disable();
      //this.allOrders =[];
      this.router.navigate(['/buildorder', {}]);
      return true;
    }

    saveOrder () : boolean {  
      this.currentOd.saveOrder(this.allOrders, this.objectSelect);
      return true;
    }

    deleteOrder () : boolean { 
      if (!this.currentOd || !this.currentOd.order || Object.keys(this.currentOd.order).length <1)
        return true;

      let dialog = this.msgService.openDelDialog('');
      
      dialog.open(DeletedialogComponent,  {
        panelClass: 'dialog-panel',
        data: { message: deletemsgod}
      }).afterClosed().subscribe(res => {  
        if (res) {
         this.currentOd.deleteOrder(this.allOrders, this.objectSelect);
        }
     })
      return true;
    }

    ngOnDestroy () {
      for (let ele of this.unsubscribes) {
          ele.unsubscribe();
      }
    }

}
