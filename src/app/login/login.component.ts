import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from '../navbar.service';
import { HttptoserverService} from '../httptoserver.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { identityRevealedValidator } from './password.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService} from '../message.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


/**
 * @author: lyi
 * 08/2020
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // For disable or enable menus
  isLoggedIn: number= 0;
  // login form
  registrationForm: FormGroup;
  unsubscribes =[] as Subscription[];

  constructor(private router: Router, private navbarService: NavbarService, 
    private registService: HttptoserverService, public msgService: MessageService) {
      this.navbarService.getLogStatus().subscribe(status => this.isLoggedIn = status);
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
              // On any screen, after login, go to home page
              this.router.navigate(['home']);
            }
            else if (respMessage && this.isLoggedIn ==0) {
              respMessage = " Login Failed. " +respMessage;
              this.msgService.openDialog(respMessage);
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
