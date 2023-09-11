import { ActivatedRoute} from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { FormGroup, AbstractControl} from '@angular/forms';
import { Orders, printNamesInOrder, fieldNamesInOrder, COrders } from '../orders';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { MatDialog} from '@angular/material/dialog';
import { HttptoserverService} from '../httptoserver.service';
import { MessageService} from '../message.service';
import { createHeaderGroup, resetDataToFormGroup, transferFormDataToPostData }  from '../formhelper';
import { Offers } from '../offers';
import { Subscription } from 'rxjs';


/**
 * @author: lyi
 * 08/2020
 */
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  // dynamic print screen help
  fieldorderNames = fieldNamesInOrder;
  printorderNames = printNamesInOrder;
  reqorderNames =['owner','item','buyer','currency', 'lading_point', 'tot_grs_value',
                  'tot_calc_cost', 'tot_qty', 'tot_grs_wgt'];
  namesLoop: number[] = [];
  // Current data of one order
  order = {} as Orders;
  // For build Order
  offer = {} as Offers;
  // Order screen form
  orderFormGroup: FormGroup;
  // For release memory of observable
  unsubscribes= [] as Subscription[];
  
  constructor (private httpService : HttptoserverService, public dialog: MatDialog,  
    public msgService: MessageService, public activeroute: ActivatedRoute) {  
  }
  
  ngOnInit () {  

      /**
       * 
        this.activeroute.paramMap.subscribe(
          paramap => {
            paramap.get('offer');
            console.log(paramap.toString());
          }
        )

        this.activeroute.params.pipe (
         switchMap( (param: Params) => 
          this.offer =  param['offer']  
        )

        this.activeroute.params.pipe (
          filter ( param => param['offer'] != null      
        ).subscribe(.....)
      **/
      this.activeroute.params
      .subscribe(
        next => {
           /**
            * type Params = { [key: string]: any;}
            * cannot use get('offer'). It is instance of json
            */
          
          if (next['offer'] ) {
            let temp  = JSON.parse(next['offer']);
            this.offer = temp;
            let keysOffer  = Object.keys(temp);
            let ord  = new COrders();

            for ( let k of keysOffer) {
              if (this.fieldorderNames.includes(k)) {
                ord.setValue(k, this.offer[k]);
              } 
            }

            this.order = ord.toJSON();
          }
        }
      );
      
      this.orderFormGroup = createHeaderGroup(this.fieldorderNames, this.reqorderNames);      
      let l =  this.printorderNames.length;
      for (let i=1; i <= l; i++ ) {
        if (i%4 == 0)
         this.namesLoop.push(i);
      }
      // copy data to FormGroup
      if (this.order!= null &&  Object.keys(this.order).length > 0) {
        resetDataToFormGroup (
          new COrders(), this.fieldorderNames, 
          [], this.orderFormGroup, '', 
          [], this.order, [], 0,
          [], [], 'Orders'
        );
      }
  }

  // When user selected a specific order and get it from server side
  selectedOrder(order_no:number, qts: Orders[]): void{
    let unsubGetOrd = this.httpService.getOrder(order_no).subscribe (
      next => {
        this.order = next;
          //update value in FormControl
        if (this.order) {
           resetDataToFormGroup (
              new COrders(), this.fieldorderNames, 
              [], this.orderFormGroup, '', 
              [], this.order, [], 0,
              [], [], 'Orders'
          );
        }
        else {
          this.msgService.openDialog("No order was found for order_no: " + order_no);
        }
      },
      error => this.msgService.openDialog( error.error)
    );
    this.unsubscribes.push (unsubGetOrd);
  }

  
  saveOrder (orderlist : Orders[], selectCtl: AbstractControl) : void {
    if (this.orderFormGroup.invalid || !this.orderFormGroup.dirty) {
      this.msgService.openDialog("Please fill required filed or update");
      return;
    }

    let respMessage: string;
    // Copy value from FormGroup to Object
    this.order = {} as Orders;
    
    this.order = transferFormDataToPostData (
       this.fieldorderNames,  [], this.orderFormGroup, 
       '', this.order, [], [], 'Orders'
    ) as Orders;

    let unsubSave = this.httpService.saveOrder(this.order).subscribe ( 
      (response: HttpResponse<any>) => 
        { 
          let oldOrdNo = this.order.order_no;
          if (response.headers && response instanceof  HttpResponse)  {
            respMessage =response.headers.get("message") ; 
            let  ordNo = Number.parseInt(response.headers.get("new_order_no")) ; 
            // update data (keys or server side changes) from server side
            this.order = response.body as Orders;
            
            resetDataToFormGroup (
                new COrders(), this.fieldorderNames, 
                [], this.orderFormGroup, '', [], this.order, [], 0,
                [], [], 'Orders'
            );

            if (ordNo) { // add new order into menu and keys except offer_no              
              if (!oldOrdNo) {
                  orderlist.push(this.order);
                  selectCtl.setValue(ordNo);
              }
            }

            this.orderFormGroup.markAsPristine();
            this.msgService.openDialog(respMessage);
          }
          else if (response instanceof  HttpErrorResponse) {
            let erMsg = response as HttpErrorResponse;
            this.msgService.openDialog( erMsg.error.toString());
          }
        }
      );

      this.unsubscribes.push (unsubSave);
  }


  deleteOrder (orderlist : Orders[], selectCtl: AbstractControl) : void {
    if (this.orderFormGroup.invalid) {
      return;
    }
    let respMessage: string;

    let unsubDel = this.httpService.deleteOrder(this.order).subscribe ( 
        (response: HttpResponse<any>) => 
        { 
          let delOrdNo = this.order.order_no;
          if (response.headers && response instanceof  HttpResponse)  {
            respMessage =response.headers.get("message") ;
            
            // reset values of FormGroup
            this.orderFormGroup.reset();
            this.order = {} as Orders;
            // remove deleted in select of menu bar
            for (let i in orderlist) {
              if (orderlist[i].order_no == delOrdNo ) {
                 orderlist.splice(Number.parseInt(i),1);
                 break;
              }
            }
            
            selectCtl.setValue('selected'); 
            this.msgService.openDialog(respMessage);
          }
          else if (response instanceof  HttpErrorResponse) {
            let erMsg = response as HttpErrorResponse;
            this.msgService.openDialog( erMsg.error.toString());
          }
        } 
    );  

    this.unsubscribes.push (unsubDel);
  }

  setOffer ( offer: Offers) : void {
    this.offer = offer;
  }

  ngOnDestroy () {
    for (let ele of this.unsubscribes) {
        ele.unsubscribe();
    }
  }

}
