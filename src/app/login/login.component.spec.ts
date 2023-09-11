import { AppRoutingModule } from './../app-routing.module';
import { async,  TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule,    HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpHeaders, HttpClient, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttptoserverService} from '../httptoserver.service';
import { MessageService } from '../message.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NavbarService } from '../navbar.service';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


/**
 * @author: lyi
 * 08/2020
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: HttptoserverService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let httpheaders = new HttpHeaders();

  httpheaders['loggedin'] = '1';

  let mockHttpResponse = new  HttpResponse({ body:'AAA', headers: httpheaders, status:200,  
                                             statusText: 'OK', url:'http://localhost:8090/enroll?userName=Lun Yi&password=AAA'});
  let element: HTMLElement;
  /**
   * Asynchronous code is common in modern Javascript applications. Testing it is mostly the same as 
   * testing synchronous code, except for one key difference: Jasmine needs to know
   * when the asynchronous work is finished.
   * 
   * Jasmine supports three ways of managing asynchronous work: async/await, promises, and callbacks, tick/Clock
   * async/await: https://volaresystems.com/technical-posts/mocking-calls-with-jasmine#:~:text=With%20Jasmine%20async%20testing%2C%20we,()%20callback%20function%20Jasmine%20provides.
   * 
   * Angular has: 
   * Done(): see app.component.spec.ts 
   * HttpTestController: See belowl
   * Spy: https://volaresystems.com/technical-posts/mocking-calls-with-jasmine#:~:text=With%20Jasmine%20async%20testing%2C%20we,()%20callback%20function%20Jasmine%20provides. 
   * fakeAsync/tick: https://angular-2-training-book.rangle.io/testing/components/async 
   * async/fixture.whenStable(): https://angular-2-training-book.rangle.io/testing/components/injecting-dependencies
   * 
   *  (1) standard javascript function:
   *  async function() {
        await someLongSetupFunction();
      }

      function returnTrueAsync() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
      }
      
      async (() => {
        await a top level asynchous function such as  returnTrueAsync();
      })
      
      (2)/(3)
      Promises have some similarities to old-style callbacks. They are essentially a returned 
      object to which you attach callback functions, rather than having to pass callbacks 
      into a function.

      https://jasmine.github.io/tutorials/async : fakeAsync/tick
      (4) If an operation is asynchronous just because it relies on setTimeout or other 
      time-based behavior, a good way to test it is to use Jasmine’s mock clock to make 
      it run synchronously.  
      jasmine.clock().tick(10000);
      Calling tick() simulates the passage of time until all pending asynchronous 
      activities finish. In this case, it waits for the error handler's setTimeout().
   * **/

  beforeEach( async (() => { 
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, HttpClientTestingModule,  BrowserModule, OverlayModule,
         MatDialogModule, FormsModule, ReactiveFormsModule, AppRoutingModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [HttptoserverService, MessageService, MatDialog, NavbarService,
        { provider: Router, useClass: class { navigate = jasmine.createSpy("navigate") } } ]
    }).compileComponents();
    service = TestBed.inject(HttptoserverService);
    httpClient = TestBed.inject(HttpClient);
    TestBed.inject(MessageService);
    TestBed.inject(MatDialog); 
    TestBed.inject(NavbarService); 
    // this is Mock
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoginComponent);
  })); 

  it('should create', () => {
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

 
  it('should get HttpClient response', () => {
    let testData =mockHttpResponse; 
    // Make an HTTP POST request
    service.register({userName: 'Lun Yi', password: 'AAA' })
        .subscribe( 
          (response: HttpResponse<any> )=> { 
            expect (1 == Number(response.body.headers.get("loggedin"))).toBeTrue; 
            fixture.componentInstance.msgService.openDialog("loggedin ==1");
            fixture.detectChanges(); // otherwise not close
            fixture.componentInstance.msgService.dialogRef.close();    
          }
      );
    // req : TestRequest
    const req = httpTestingController.expectOne(
      new HttpRequest ( 'GET', 'http://localhost:8090/enroll?userName=Lun Yi&password=AAA', '')
    );

    /**
     * Respond with mock data, causing Observable to resolve. 
     * Subscribe callback asserts that correct data was returned.
     */
    req.flush(testData);
  
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });


  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';
  
    service.register({userName: 'Lun Yi', password: 'AAAAAAAA' }).subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'deliberate 404 error');
      }
    );
  
    const  req: TestRequest  = httpTestingController.expectOne(
      req =>  ( req.url=='http://localhost:8090/enroll?userName=Lun Yi&password=AAAAAAAA')
    );
    
    // Respond with mock error and resolve observable
    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

});