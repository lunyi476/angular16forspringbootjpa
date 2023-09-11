import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Quotes, fieldNamesInQuote, CQuotes } from '../quotes';
import { FormGroup, AbstractControl} from '@angular/forms';
import { Offers, fieldNamesInOffer } from '../offers';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { HttptoserverService } from '../httptoserver.service';
import { MessageService } from '../message.service';
import {  Subscription } from 'rxjs';
import { createHeaderGroup, addDetailGroup,resetDataToFormGroup, transferFormDataToPostData }  from '../formhelper';

/**
 * @author: lyi
 * 08/2020
 */
@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit, OnDestroy {
  // For help of dynamic print HTML form, initial it and prevent 'undefined'
  offerFormGroupNames: string[] =[];
  fieldquoteNames = fieldNamesInQuote;
  fieldofferNames = fieldNamesInOffer;
  reqofferNames =['item','buyer',
    'currency', 'lading_point'];
  reqquoteNames =['owner', 'item', 'requested_by','request_price',
    'allocated_qty'];
  prefixOfferGroupName: string = 'offerFormGroup_';
  blockedNames = ['offers'];
  /**
   * Only increase(no decrease) at adding new offer group after initialized at selectedQuote()
   * because used for tracking offer group name which may deleted or new added.
   * So, the offer group name may be offerFormGroup_0, _3, _4, _6.....
   * 
   * Save/Delete will not change offersize until selectedQuote() call.
   * It is like Sequence Number of DB at some point.
   * 
   */
  offerSize: number =0;
  // Current data of one quote
  quote: Quotes = null;
  // initial it, otherwise 'undefined'
  offer: Offers[] =[];
  // Two way data binding
  quoteFormGroup: FormGroup;
  // For delete local row of offer detail
  needDeleteRows: string[] = [];
  // For unsubscribe of Observables
  unsubscribes = [] as Subscription[];
  /**
   * (1) Circle referencing issue
   * @Inject(forwardRef(() => AppComponent)) public appComp?: AppComponent with warning but works.
   * It brings conveniences for updating menu status of AppComponent if in use.
   *
   * In case of circle referencing, need to alalyze it although warning.
   * It may have problem, may be OK.
   * AppComponent always created before QuoteComponent, so reference to AppComponent is OK.
   * Reference (currentQut) in AppComponent to QuoteComponent (this) 
   * is intialed inside constructor of AppComponen through route-outlet.
   *
   * At first HomeComponent, even AppComponent not completed creating object,
   * HomeComponent not use reference to AppComponent, it will not break.
   * currentQt is null.
   *
   * At QuoteComponent creating, appComp never be null and currentQt referrence will
   * be assign non-null value before/after Quote complete creating, but always happens before
   * user use it. 
   *
   * (2)
   * ElementRef (any DOM element), 
   * 
   * View (Host, Embedded),
   * 
   * HostView(Component view), 
   * 
   * EmbbeddedView (
   *  Manually:
   *  created/Instantiate Embedded View by ViewContainerRef.createEmbeddedView(TemplateRef)
   *  <ng-template dinoInstantiateView> or  <ng-template #mytemplate>
   *  TemplateRef can be obtained by ViewChild (dinoInstantiateView) or ViewChild(mytemplate).
   * 
   *  Auto:
   *  <ng-template #myTemplate> Hello Worl! </ng-template>
   *  <ng-container *ngTemplateOutlet="myTempalte"></ng-container>
   * ) ,
   * 
   * TemplateRef (
   *  ng-template, its content will not dispaly until it was instatiated by created (EmbbeddedView)
   *  or if/else/then... directive
   * ), 
   * 
   * ViewContainerRef (
   *  It can be any Element with Anchor (<>), ng-container/template has <!------> comment Anchor.
   *  Get ViewContainerRef from template reference variable, directive, component directive
   *  by ViewChild or Injection in constructor. By using it to create view, and Views 
   *  are rendered as siblings.
   * )
   * 
   * ContentChild (
   *  Any element or component (projected by Selector) which is projected inside is accessed as ContentChild.
   *  Such as: <ng-content></ng-template>, <app-quote></app-quote> (inside AppComponent) laceholder projected content.
   * )
   * 
   * ViewChild (
   *  return:
   *  Child Component
   *  Directive
   *  DOM Element
   * )
   * 
   * <ng-content> </ng-content> placeholder for projeting dynamic content, when the template is parsed 
   * Angular will replace that placeholder tag with your content.
   * <ng-content> in Templete of Component and content in HTML of Component will be projected
   * to replace <ng-content>.
   * 
   * https://docs.google.com/presentation/d/1inX3SsUhK8qGidfMxZmirCfR30Iu0mJfQP1NrPhZ0Ic/edit#slide=id.g4443d78395_1_241
   *
   *
   */
  constructor (private httpService : HttptoserverService,
    public dialog: MatDialog,  public msgService: MessageService) {  
  }
  
  ngOnInit () {    
      this.quoteFormGroup = createHeaderGroup(this.fieldquoteNames, this.reqquoteNames);        
  }

  
  addOfferGroup () {
    this.offerSize = addDetailGroup(this.quoteFormGroup, this.prefixOfferGroupName, 
      this.fieldofferNames, this.offerFormGroupNames, this.offerSize, this.reqofferNames);
  }

  newQuote () : boolean {   
    this.offerSize =0;
    this.quoteFormGroup = null;
    this.offerFormGroupNames =[];
    this.quote = null;
    this.offer = [];

    this.quoteFormGroup = createHeaderGroup(this.fieldquoteNames, this.reqquoteNames);     
    return false;
  }

  // When user selected a specific quote and get it from server side
  selectedQuote(request_no:number): void{
    let subGetQuote = this.httpService.getQuote(request_no).subscribe (
      next => {
        this.quote = next;
          //fill data into FormControl
        if (this.quote) {
           this.offerSize = resetDataToFormGroup (
              new CQuotes(), this.fieldquoteNames, 
              this.fieldofferNames, this.quoteFormGroup, this.prefixOfferGroupName, 
              this.offerFormGroupNames, this.quote, this.offer, this.offerSize,
              this.reqofferNames, this.blockedNames, 'Quotes'
          );
        }
      },
      error => this.msgService.openDialog( error.error)
    );
    this.unsubscribes.push(subGetQuote);
  }

  

  saveQuote (quotelist : Quotes[], selectCtl: AbstractControl) : void {
    if (this.quoteFormGroup.invalid || !this.quoteFormGroup.dirty ) {
      this.msgService.openDialog("Please fill required filed or update");
      return;
    }

    let respMessage: string;
    // For coping form data
    this.quote = {} as Quotes;
    // Copy form data to quote for posting
    this.quote = transferFormDataToPostData (
       this.fieldquoteNames,  this.fieldofferNames, this.quoteFormGroup, 
       this.prefixOfferGroupName, this.quote, this.offer, this.blockedNames, 'Quotes'
    ) as Quotes;

    let subSaveQuote = this.httpService.saveQuote(this.quote).subscribe ( 
      (response: HttpResponse<any>) => 
        { 
          // identify it is new or existed 
          let oldReqNo = this.quote.request_no;
          // Handle response of succed or fail
          if (response.headers && response instanceof  HttpResponse)  {
            respMessage =response.headers.get("message") ; 
            let  reqNo = Number.parseInt(response.headers.get("new_request_no")) ; 
            // update data (keys or server side changes) from server side
            this.quote = response.body as Quotes;
            // Update form group with data
            this.offerSize = resetDataToFormGroup (
                new CQuotes(), this.fieldquoteNames, 
                this.fieldofferNames, this.quoteFormGroup, this.prefixOfferGroupName, 
                this.offerFormGroupNames, this.quote, this.offer, this.offerSize,
                this.reqofferNames, this.blockedNames, 'Quotes'
            );

            if (reqNo) { // add new quote into menu and key if it is new        
              if (!oldReqNo) {
                  quotelist.push(this.quote);
                  selectCtl.setValue(reqNo);
              }
            }
            // To prevent click save again
            this.quoteFormGroup.markAsPristine();
            // display message
            this.msgService.openDialog(respMessage);
          }
          else if (response instanceof  HttpErrorResponse) {
            let erMsg = response as HttpErrorResponse;
            this.msgService.openDialog( erMsg.error.toString());
          }
        } 
      );

      this.unsubscribes.push(subSaveQuote);
  }


  deleteQuote (quotelist : Quotes[], selectCtl: AbstractControl) : void {
    if (this.quoteFormGroup.invalid) {
      return;
    }
    let respMessage: string;

    let subDelQuote = this.httpService.deleteQuote(this.quote).subscribe ( 
        (response: HttpResponse<any>) => 
        { 
          let delReqNo = this.quote.request_no;
          if (response.headers && response instanceof  HttpResponse)  {
            respMessage =response.headers.get("message") ;            
            // reset values of FormGroup
            this.quoteFormGroup.reset();
            let ctls = this.quoteFormGroup.controls;
            let controlNames = Object.keys(ctls);
            // remove all offer form group
            for (let n of controlNames) {
              if (n.indexOf(this.prefixOfferGroupName) >=0) {
                this.quoteFormGroup.removeControl(n);
              }
            }
            // clear current cached data to display empty on form
            this.offerFormGroupNames =[];     
            this.quote = null;
            this.offer = [];
            // remove deleted in select of menu bar
            for (let i in quotelist) {
              if (quotelist[i].request_no == delReqNo ) {
                 quotelist.splice(Number.parseInt(i),1);
                 break;
              }
            }
            // Update menu in AppComp screen
            selectCtl.setValue('selected');
            // display message 
            this.msgService.openDialog(respMessage);
          }
          else if (response instanceof  HttpErrorResponse) {
            let erMsg = response as HttpErrorResponse;
            this.msgService.openDialog( erMsg.error.toString());
          }
        } 
    );  

    this.unsubscribes.push(subDelQuote);
  }

  
  /**
   * delete detail row at local in form but not in cached which will 
   * be override at submitting to server
   */
  deleteRow () {
    for ( let i=0; i < this.needDeleteRows.length; i++) {
      let deletedRow = this.offerFormGroupNames.filter( 
                  o=> o == this.needDeleteRows[i]);

      this.quoteFormGroup.removeControl(deletedRow[0]);
      let ind = this.offerFormGroupNames.indexOf(deletedRow[0]);
      this.offerFormGroupNames.splice(ind, 1);
    }
    this.needDeleteRows = [];
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type == "checkbox") {
        inputs[i].checked = false;
      }
    }
    // This will allow save processing after delete one row
    this.quoteFormGroup.markAsDirty();
  }
  // Which row selected to delete at local
  checkedBox (offerFormGroupNames: string, event) {
    if (event.target.checked)
      this.needDeleteRows.push(offerFormGroupNames);
    else {
      let ind = this.needDeleteRows.indexOf(offerFormGroupNames);
      this.needDeleteRows.splice(ind, 1);
    }
  }

  ngOnDestroy () {
    for (let ele of this.unsubscribes) {
        ele.unsubscribe();
    }
  }

}
