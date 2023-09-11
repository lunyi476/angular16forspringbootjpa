import { MessageService } from './../message.service';
import { Component, OnInit, ChangeDetectorRef, Inject, forwardRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService} from '../navbar.service';
import { HttptoserverService } from '../httptoserver.service';
import { Offers,fieldNamesInOffer, notprintNamesBuild, printNamesBuild, COffers  } from '../offers';
import { FormGroup } from '@angular/forms';
import { createHeaderGroup, resetDataToFormGroup, transferFormDataToPostData }  from '../formhelper';
import { AppComponent } from '../app.component';
import { Subscription } from 'rxjs';

/**
 * @author: lyi
 * 08/2020
 */
@Component({
selector: 'buildorder-component',
templateUrl: './buildorder.component.html',
styleUrls: ['./buildorder.component.css']
})
export class BuildorderComponent implements OnInit, OnDestroy {
    // select or remove
    currentSRimg = 'assets/images/mr.gif';
    // over or out
    currentOUimg = 'assets/images/ml.gif';
    // print screen helper
    fieldofferNames = fieldNamesInOffer;
    buildscreenNames = printNamesBuild;
    prefixOfferGroupName: string = 'offerFormGroup_';
    blockedNames = notprintNamesBuild;
    // release memory of observable
    unsubscribes =[] as Subscription[];
    // For building order
    selectedOffer = {} as Offers;
    // left side form
    headerFormGroup = {} as FormGroup;
    offerFormGroupNames = [] as string[];
    allOffers = []  as Offers[];    
    offerSize: number =0;
    LRowSelected = '';
    // right size form
    headerFormGroupR = {} as FormGroup;
    offerFormGroupNamesR = [] as string[];
    allOffersR = [] as Offers[];
    offerSizeR: number =0;
    RRowSelected = '';

    constructor(private router: Router, public navbarService: NavbarService,  
        private httpService : HttptoserverService, private msgService: MessageService,
        private changeDetector: ChangeDetectorRef, @Inject(forwardRef(() => 
        AppComponent)) public appComp?: AppComponent) {
    }

    ngOnInit(){
        let subGetOffers = this.httpService.getOffers().subscribe (
            next => { 
              this.allOffers = next;    
              if (this.allOffers.length > 0) {
                // fill data into offer form groups
                this.offerSize =  resetDataToFormGroup(new COffers(), [],
                    this.fieldofferNames, this.headerFormGroup, this.prefixOfferGroupName,
                    this.offerFormGroupNames, {}, this.allOffers, this.allOffers.length,
                    [], this.blockedNames, 'Offers');
                
             }
              this.changeDetector.detectChanges();                                                 
            }, 
            error => this.msgService.openDialog(error.error)
          )
       // empty group to group offer details
       this.headerFormGroup =   createHeaderGroup([],[]);
       this.headerFormGroupR =   createHeaderGroup([],[]);

       this.unsubscribes.push(subGetOffers);
    }
    // Go to order screen
    gotoOrder () {
        // for using same function, empty param
        let details = [] as Offers[];
        // Copy screen data to offer
        this.selectedOffer = transferFormDataToPostData( [], this.fieldofferNames, 
            this.headerFormGroupR, this.prefixOfferGroupName,
                 {}, details, this.blockedNames, 'Offers') as Offers;

        if (!this.selectedOffer) return;
         // update menu in AppComponent
         this.appComp.disabled =0;
         this.appComp.selectControl.enable();
        //another way to pass params is: this.appComp.getOrderComp().setOffer(this.selectedOffer);
        this.router.navigate(['/order', {'offer': JSON.stringify(this.selectedOffer)}]);
    }

    // id identify row anf also the FormGroup name, which row selected
    selectedRRow (id: string) {  
        let trRowNew = document.getElementById(id);
        trRowNew.style.backgroundColor ='#e9eaf3';

        if (this.RRowSelected) {
            let trRowOrig = document.getElementById(this.RRowSelected);
            trRowOrig.style.backgroundColor ='';
        }
        this.RRowSelected = id;
        
    }
    
    selectedLRow (id: string) {
        let trRowNew = document.getElementById(id);
        trRowNew.style.backgroundColor ='#e9eaf3';

        if (this.LRowSelected) {
            let trRowOrig = document.getElementById(this.LRowSelected);
            trRowOrig.style.backgroundColor ='';
            
        }    
        this.LRowSelected = id;    
    }

    // move selected row to right
    moveOfferToR () {
        if (!this.LRowSelected) return;
        let ctls = this.headerFormGroupR.controls;
        let controlNames = Object.keys(ctls);
        // nly one offer allowed to build order
        if (controlNames.length > 0) return;

        let offerGroupSelected = this.headerFormGroup.get(this.LRowSelected) as FormGroup;
        this.headerFormGroupR.setControl(this.LRowSelected, offerGroupSelected);
        this.headerFormGroup.removeControl(this.LRowSelected);
        let pos = this.offerFormGroupNames.indexOf(this.LRowSelected);
        let temp = this.offerFormGroupNames.splice(pos,1);
        this.offerFormGroupNamesR.push(temp[0]);
        this.LRowSelected ='';
    }

    // move selected row to left
    moveOfferToL () {
        if (!this.RRowSelected) return;
        let offerGroupSelected = this.headerFormGroupR.get(this.RRowSelected) as FormGroup;
        this.headerFormGroup.setControl(this.RRowSelected, offerGroupSelected);
        this.headerFormGroupR.removeControl(this.RRowSelected);
        let pos = this.offerFormGroupNamesR.indexOf(this.LRowSelected);
        let temp = this.offerFormGroupNamesR.splice(pos,1);
        this.offerFormGroupNames.push(temp[0]);
        this.RRowSelected ='';
    }

    // image flip
    flipimg (flag: string, src: string) {  
        if (flag=='rover') {
            this.currentSRimg = src;
        } else if (flag=='rout') {
            this.currentSRimg = src;
        } 
        else if (flag=='lover') {
            this.currentOUimg = src;
        } else if (flag=='lout') {
            this.currentOUimg = src;
        } 
    }
    // componennt killed
    ngOnDestroy () {
        this.appComp.disabled =0;
        this.appComp.selectControl.enable();
        for (let ele of this.unsubscribes) {
            ele.unsubscribe();
        }
    }
}