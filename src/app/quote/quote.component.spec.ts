import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { QuoteComponent } from './quote.component';
import { HttptoserverService} from '../httptoserver.service';
import { MessageService} from '../message.service';
import { Quotes, CQuotes}  from '../quotes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule,   } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { defer, from, of} from 'rxjs';
import { ElementRef, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { resetDataToFormGroup }  from '../formhelper';

/**
 * @author: lyi
 * 08/2020
 */
class MockElementRef implements ElementRef {
  nativeElement = {};
} 

class MockhHttptoserverService {
  public quote: Quotes =  { request_no: 1, owner: 'Bamboorose',item: 'food', description: 'testing', requested_by: 'Lun Yi', 
  request_price: 10, currency: 'USD', delivery_terms: '2020-07-39', allocated_qty: 100, 
  category: '',item_class:'',division:'',brand:'',dept:'',buyer:'', import_cntry:'', 
  offers: [
    { offer_no : 1, owner : 'Bamboorose' , item : 'food' ,request_no : 1 ,  description : 'food supply' , offer_date : new Date(2020, 7, 31) ,status : 
    'open', buyer : 'Lun Yi' ,supplier :  'Stop Shop',vendor_name : 'Stop Shop' ,manufacturer :  'Tyson',
    carrier :  'Carrier',delivery_terms : '' ,payment_type : '' ,payment_terms : '' ,currency : 'USD' ,origin_cntry : '' ,first_ship_date : null ,
    last_ship_date : null ,lading_point : 'MA' ,final_dest : null   }, 
    {offer_no : 2, owner : 'Bamboorose' , item : 'beef' ,request_no : 1 ,  description : 'beef supply', offer_date :  new Date(2020, 7, 30) ,status : 
    'open', buyer : 'Lun Yi' ,supplier :  'Stop Shop',vendor_name : 'Stop Shop' ,manufacturer :  'Tyson',
    carrier :  'Carrier',delivery_terms : '' ,payment_type : '' ,payment_terms : '' ,currency : 'USD' ,origin_cntry : '' ,first_ship_date : null ,
    last_ship_date : null ,lading_point : 'CA' ,final_dest : null }
]};
  
  getQuote(id: number) {
    // of() observable is synchronous
    return of( this.quote);
  }

  getQuoteAsync (id: number) {
    // Asynchronous way
    return from(Promise.resolve(this.quote));
  }
}

function getQuoteAsync (id: number, service: MockhHttptoserverService) {
  // Asynchronous way
  return new Promise ( 
    (resolve, reject) => { 
      if(service == null) {
        reject(`Set to rejected`); 
      } else { 
        resolve(service.quote);
      }
      return;
    }
  ) 
}

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

fdescribe('QuoteComponent', () => {
  /**
   *  constructor(_overlay: Overlay, _injector: Injector,  _location: Location, _defaultOptions: MatDialogConfig, 
   *              scrollStrategy: any, _parentDialog: MatDialog, _overlayContainer: OverlayContainer);
   * 
   *  const injector = ReflectiveInjector.resolveAndCreate( [MatDialog]); // Injector.create() ??
   *  let mockMessageService = new MockMessageService (injector.get(MatDialog));
   * 
   */
  let component: QuoteComponent;  
  let fixture: ComponentFixture<QuoteComponent>;
  let mockHttptoserverService = new MockhHttptoserverService();
  
  // Because compileComponents is asynchronous, it uses the async utility function 
  beforeEach(async(() => {
    // configure testing module, just like NgModule in project
    TestBed.configureTestingModule({
      providers:    [ 
        { provide: HttptoserverService, useValue: mockHttptoserverService},
        { provide: MessageService, userClass: MessageService },
        MatDialog,
        { provide: ElementRef, useClass: MockElementRef }
      ],
      declarations: [ QuoteComponent ],
      imports : [HttpClientModule, MatDialogModule, ReactiveFormsModule, 
        FormsModule,   RouterModule,  RouterTestingModule  ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]    
    }).compileComponents();  
  }));

  beforeEach(() => {
    TestBed.inject (HttptoserverService);
    TestBed.inject (MatDialog);
    TestBed.inject (MessageService);
    TestBed.inject (ElementRef);

    fixture = TestBed.createComponent(QuoteComponent);
    // If test in non-browser environment, use: (https://angular.io/guide/testing-components-basics)
    component = fixture.componentInstance;
    // Binding Data, need frequently call detectChanges for everychanges
    // Or { provide: ComponentFixtureAutoDetect, useValue: true } to void frequntly call
    fixture.detectChanges();
  });


  it('should create QuoteComponent', () => {
    expect(component).toBeTruthy();
    expect(!component.quoteFormGroup.get("offerFormGroup_0")).toBeTrue();
    expect(component.offerSize ==0).toBeTrue();
  });

  // Synchronous way testing
  it('should get quote and display',  () => {
    // Mock service, it is actual synchronous, inside call resetDataToFormGroup
    component.selectedQuote(1);
    fixture.detectChanges(); // update view with quote

    // check DOM Element
    let qt = fixture.nativeElement.querySelector("#owner"); 
    expect(qt.value != null && (<string>qt.value).toUpperCase() =='BAMBOOROSE').toBeTrue();
    let detail = fixture.nativeElement.querySelector("#offerFormGroup_0item") as HTMLInputElement;
    expect(detail.value != null && (detail.value =='food' || detail.value =='beef')).toBeTrue();
  });

   // Asynchronous way testing, why fake because useing tick() to wait
  it('should get quote with multiple offers and display',  fakeAsync (() => {
    let d: Quotes;
    mockHttptoserverService.getQuoteAsync(1).subscribe (
      observer => d = observer
    );

    // await here until after flushing the observable to get the quote
    tick();
  
    component.quote = d;
    component.offerSize = resetDataToFormGroup (
                new CQuotes(), component.fieldquoteNames, 
                component.fieldofferNames, component.quoteFormGroup, component.prefixOfferGroupName, 
                component.offerFormGroupNames, component.quote, component.offer, component.offerSize,
                component.reqofferNames, component.blockedNames, 'Quotes'
            );

    fixture.detectChanges();

    // check DOM Element
    let qt = fixture.nativeElement.querySelector("#owner"); 
    expect(qt.value != null && (<string>qt.value).toUpperCase() =='BAMBOOROSE').toBeTrue();
    let detail = fixture.nativeElement.querySelector("#offerFormGroup_1item") as HTMLInputElement;
    expect(detail.value != null && (detail.value =='food' || detail.value =='beef')).toBeTrue();
  }));

   // Asynchronous way testing
  it('should get quote asynchronously and display', async () => {
    let d: Quotes;
    // only wait fortop level async function or Promise to finish, not "of(..)"  from Observable
    await   getQuoteAsync(1,  mockHttptoserverService).then<Quotes>( value => d = <Quotes>value);
    fixture.detectChanges();

    expect(fixture.isStable()).toBe(true, 'expect fixture not to be stable');
    component.quote = d;
    component.offerSize = resetDataToFormGroup (
      new CQuotes(), component.fieldquoteNames, 
      component.fieldofferNames, component.quoteFormGroup, component.prefixOfferGroupName, 
      component.offerFormGroupNames, component.quote, component.offer, component.offerSize,
      component.reqofferNames, component.blockedNames, 'Quotes'
    ); 
    fixture.detectChanges();

    // check DOM Element
    let qt = fixture.nativeElement.querySelector("#owner"); 
    expect(qt.value != null && (<string>qt.value).toUpperCase() =='BAMBOOROSE').toBeTrue();
    let detail = fixture.nativeElement.querySelector("#offerFormGroup_1item") as HTMLInputElement;
    expect(detail.value != null && (detail.value =='food' || detail.value =='beef')).toBeTrue();
  
  });


  // Asynchronous way testing, similar to fakeAsync
  it('should get quote asynchronously and display',  async (() => {
    let d: Quotes;
    getQuoteAsync(1, mockHttptoserverService).then<Quotes>( value => d = <Quotes>value);
    // wait for async getQuote, otherwise, offer and quote are null
    fixture.whenStable().then(() => { 
      fixture.detectChanges();        
      component.quote = d;
      component.offerSize = resetDataToFormGroup (
        new CQuotes(), component.fieldquoteNames, 
        component.fieldofferNames, component.quoteFormGroup, component.prefixOfferGroupName, 
        component.offerFormGroupNames, component.quote, component.offer, component.offerSize,
        component.reqofferNames, component.blockedNames, 'Quotes'
      );

      fixture.detectChanges();

    // check DOM Element
    let qt = fixture.nativeElement.querySelector("#owner"); 
    expect(qt.value != null && (<string>qt.value).toUpperCase() =='BAMBOOROSE').toBeTrue();
    let detail = fixture.nativeElement.querySelector("#offerFormGroup_1item") as HTMLInputElement;
    expect(detail.value != null && (detail.value =='food' || detail.value =='beef')).toBeTrue();
    });
  }));

});
