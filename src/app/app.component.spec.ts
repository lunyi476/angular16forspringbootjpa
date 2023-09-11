import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, async,  fakeAsync, tick, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Quotes}  from './Quotes';
import { from, defer, of } from 'rxjs';
import { HttptoserverService} from './httptoserver.service';
import { Router, ActivatedRoute} from '@angular/router';
import { ElementRef } from '@angular/core';
import { NavbarService } from './navbar.service';
import { MatDialogModule,  MatDialog } from '@angular/material/dialog';
import { By, BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/**
 * @author: lyi
 * 08/2020
 */
class MockElementRef implements ElementRef {
  nativeElement = {};
} 

/** Create async observable that emits-once and completes
 *  after a JS engine turn */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

class MockhHttptoserverService {
  public static quotes: Quotes[] =  [{ request_no: 1, owner: 'Bamboorose',item: 'food', description: 'testing', requested_by: 'Lun Yi2', 
                                request_price: 10, currency: 'USD', delivery_terms: '2020-07-30', allocated_qty: 100,   
                                offers : null},
                                { request_no: 2, owner: 'Bamboorose',item: 'beef', description: 'testing', requested_by: 'Lun Yi3', 
                                request_price: 10, currency: 'USD', delivery_terms: '2020-07-30', allocated_qty: 100,   
                                offers : null},
                                { request_no: 3, owner: 'Bamboorose',item: 'chicken', description: 'testing', requested_by: 'Lun Yi4', 
                                request_price: 10, currency: 'USD', delivery_terms: '2020-07-30', allocated_qty: 100,   
                                offers : null} ];                                            
  getQuotes() {
    return  from (
      Promise.resolve(
        MockhHttptoserverService.quotes)
        );
  }
}


function getAllQuotes () {
  return Promise.resolve( MockhHttptoserverService.quotes);
}


describe('AppComponent', () => {
  let httpClientSpy : jasmine.Spy;
  let mockHttptoserverService = new MockhHttptoserverService();
  let httpClient : HttpClient;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,  MatDialogModule, BrowserAnimationsModule,
        BrowserModule,ReactiveFormsModule, AppRoutingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers:    [ // Mock Data better for unit testing because its isolation
        { provide: HttptoserverService, useValue: mockHttptoserverService},
        MatDialog,
        {
          provide: ActivatedRoute,
          useValue: {
              snapshot: {
                  paramMap: {
                      get(): string {
                          return '123';
                      },
                  },
              },
          },
        },
        { provider: Router, useClass: class { navigate = jasmine.createSpy("navigate") } },
        { provide: ElementRef, useClass: MockElementRef },
        { privide: NavbarService, useClass: NavbarService}
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockHttptoserverService = new MockhHttptoserverService();
    //httpClientSpy = jasmine.createSpyObj('HttptoserverService', ['getQuotes']);
    TestBed.inject(HttptoserverService);
    httpClient = TestBed.inject(HttpClient);
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Use Done() test Asynchronous task
  it('#should get all quotes directly from Mock service',
    (done: DoneFn) => {
      mockHttptoserverService.getQuotes().subscribe(value => {
          expect(value[0].request_no).not.toBeNull();
      done();
    });
  });

  /** 
   * Synchronous way to test asynchronous task, 
   * this spy bypasses the server and returns a synchronous 
   * observable whose value is available immediately.
   **/
  it('should get all quotes (HttpClient called once) Spy way', () => {   
    spyOn(mockHttptoserverService, 'getQuotes').and.returnValue(
      of (MockhHttptoserverService.quotes)) ;

    mockHttptoserverService.getQuotes().subscribe(
      quotes => expect(quotes.length).toEqual(3, 'expected quotes size'),
      fail
    );
    expect(mockHttptoserverService.getQuotes).toHaveBeenCalled();
  });


  it('should get all quotes by async/await way and updated select', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // must call this, otherwise : selectInput always null
    fixture.detectChanges();
    /** Only module top level function which return Promise has effect
     * return resolved value
     **/
    let qts = await getAllQuotes();
    app.allQuotes = qts;
  
    const navService = app.navbarService; //cannot use different : new NavbarService();
    navService.updateMenu('quote');
    app.links = navService.links2;
    app.selectedQtNo = app.allQuotes[0].request_no.toString();
    app.selectControl.get('objectSelect').setValue(app.selectedQtNo);
    // must call, otherwise selectInput is null
    fixture.detectChanges();

    const selectInput: HTMLSelectElement = fixture.debugElement.query(By.css('#qtSelect')).nativeElement;
    expect(selectInput.value == app.selectedQtNo).toBeTrue();
    expect(app.allQuotes.length == 3 ).toBeTruthy();

    selectInput.value = selectInput.options[0].value;  // <-- select a new value
    selectInput.dispatchEvent(new Event('change'));
    fixture.detectChanges(); 

    let text = selectInput.options[selectInput.selectedIndex].label;
    expect(text).toBe('Select Quote');
    expect(selectInput.value != app.selectedQtNo).toBeTrue();
    
  });

  // fakeAsync comes to the rescue and helps to test asynchronous code in a synchronous way. 
  //Tick can also be used with no argument, in which case it waits until 
  //all the microtasks are done (when promises are resolved for example).
  it ('should selectQuote event fired and update selection menu', fakeAsync ( () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // AppComponent get allquotes by calling MockService
    app.getQuotes();
    // if remove it, lin2 182 :  Cannot read property 'value' of undefined
    tick();
    const navService = app.navbarService; //cannot use different instance: new NavbarService();
    navService.updateMenu('quote');
    app.links = navService.links2;
    fixture.detectChanges();
     
    //To simulate user input and event
    spyOn(app, 'selectedQuote'); // without spy we cannot use expect to check invoked or not
     // only one select
     const selectInput: HTMLSelectElement = fixture.debugElement.query(
       By.css('select')).nativeElement;
    // simulate user selecting somthing
    selectInput.selectedIndex= 2;

    selectInput.value = selectInput.options[2].value;
    // dispatch a DOM event so that Angular learns of input value change.
    fixture.whenStable().then(() => {
      // without dispatch, selectedQuote will not be called
      selectInput.dispatchEvent(new Event ('change'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // check spies
        expect(app.selectedQuote).toHaveBeenCalled();
      });
    });
    // without this call, error “1 timer(s) still in the queue”
    flush();
    
  }));

});
