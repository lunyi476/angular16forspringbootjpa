import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ElementRef, Inject, InjectionToken, ViewContainerRef  } from '@angular/core';
import { NavbarService } from '../navbar.service';
import { HttptoserverService} from '../httptoserver.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, NgForm, Form } from '@angular/forms';
import { identityRevealedValidator } from './password.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService} from '../message.service';
import { Router } from '@angular/router';
import { Subscription, Observable, of} from 'rxjs';
import { NgIf, DOCUMENT } from '@angular/common';


/**
 * @author: lyi
 * 08/2020
 */
export const BROWSER_WINDOWS = new InjectionToken<Window>('Browser Window', {
  providedIn: 'root',
  factory: () => window
});


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, NgIf]
})
export class LoginComponent implements OnInit, OnDestroy {
  // For disable or enable menus
  isLoggedIn: number= 0; 
  // login form
  //  As soon as you import the `FormsModule`, this directive becomes active by default on
  //  all `<form>` tags, it is NgForm directive.  You don't need to add a special selector.
  registrationForm: FormGroup;
  unsubscribes =[] as Subscription[];
  // can access after ngAfterViewInit run, cannot access it in ngOnInit
  @ViewChild('formDirective', { static: false })   child!: NgForm;

  constructor(private router: Router, private navbarService: NavbarService, 
    private registService: HttptoserverService, public msgService: MessageService, private _vcr: ViewContainerRef ) //  @Inject(DOCUMENT) private document: Document,
    //@Inject(BROWSER_WINDOWS) private myWindow: Window, ref: ElementRef)
   {
      this.navbarService.getLogStatus().subscribe(status => this.isLoggedIn = status);
     // console.log(document.defaultView.history.length + " --------    "+myWindow.history.length);
      //let elem = ref.nativeElement as HTMLElement;
     /** const obsUsingConstructor = new Observable( observer => { // observer is unknown at this time until Subscriber/Observer user to subscribe on Observable
        observer.next( '1' );  // call Observer's next function at certain/later time of Observer subscribing  by value 1
        observer.next( '2' );
        observer.next( '3' );
   
        observer.complete();
     })
     
     // at this time, the Observer is passed to Obervable, also will trigger Observable call observer's next function
     obsUsingConstructor
          .subscribe(val => console.log(val),
                  error=> console.log("error"),
                  () => console.log("complete"));
    
      // add Subscriber which is number array
      let ayy  = of(1,2,3,4,5) as Observable<Number>;
      // subscribing Observer to retrieve Subscriber array data
      ayy.subscribe(val => console.log(val),
                    error=> console.log("error"),
                    () => console.log("complete"));
      **/
  }

  ngOnInit() {
      this.registrationForm = this.createQuoteGroup () ;
  }

  createQuoteGroup () : FormGroup {
    let quoteGroup = new FormGroup ( 
      {
        'userName': new  FormControl ('', [Validators.required, Validators.minLength(4)]),
        'password': new  FormControl ('', [Validators.required, Validators.minLength(6)])
      }
    ); 
    quoteGroup.setValidators(identityRevealedValidator);

    return quoteGroup;
  }


  get userName() {
    return this.registrationForm.get('userName');
  }

  get password() {
    return this.registrationForm.get('password');
  }

 
  onSubmit() {
    
    let respMessage: string;

    let subRegister = this.registService.register(this.registrationForm.getRawValue())
      .subscribe(
         ( response: any) => {  
          if (response.headers.get('loggedin')) {
            this.isLoggedIn = Number(response.headers.get('loggedin'));
            if (this.isLoggedIn ==1) {
              this.navbarService.updateLoginStatus(this.isLoggedIn);
              respMessage = " Login Succed.";
              // Prevent submit again without any chnages
              this.registrationForm.markAsPristine();
              this.msgService.openDialog(respMessage);
              //this.msgService.openDialog(respMessage, this);
              // On any screen, after login, go to home page
              this.router.navigate(['home']);

            }
            else if (respMessage && this.isLoggedIn ==0) {
              respMessage = " Login Failed. " +respMessage;
              
            }
          }
         },
         (error : HttpErrorResponse ) => { 
           this.msgService.openDialog(error.error); 
         }       
    );

    this.unsubscribes.push(subRegister);
  }
  
  ngOnDestroy () {
    for (let ele of this.unsubscribes) {
        ele.unsubscribe();
    }
  }
}
