import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Quotes, CQuotes } from './quotes';
import { COffers, Offers } from './offers';
import { COrders, Orders } from './orders';
import { ToFromJSon } from './tofromjson';

/**
 * @author: lyi
 * 08/2020
 */
/** Functions to transfer data from/to FormGroup */
export function createHeaderGroup(fieldNamesInHeader: string[], reqHeaderNames: string[]): FormGroup {
    let headerGroup = new FormGroup({});

    for (let i = 0; i < fieldNamesInHeader.length; i++) {
        if (reqHeaderNames.includes(fieldNamesInHeader[i])) {
            headerGroup.addControl(fieldNamesInHeader[i], new FormControl('', Validators.required));
        }
        else {
            headerGroup.addControl(fieldNamesInHeader[i], new FormControl(''));
        }
    }

    return headerGroup;
}


export function addDetailGroup(headerFormGroup: FormGroup, prefixDetailGroupName: string,
    fieldNamesInDetail: string[], detailFormGroupNames: string[], detailSize: number,
    reqDetailNames: string[]): number {

    headerFormGroup.addControl(
        prefixDetailGroupName + detailSize.toString(),
        new FormGroup({})
    );

    let detailGroup = <FormGroup>headerFormGroup.get(prefixDetailGroupName + detailSize.toString());

    for (let i = 0; i < fieldNamesInDetail.length; i++) {
        if (reqDetailNames.includes(fieldNamesInDetail[i])) {
            detailGroup.addControl(fieldNamesInDetail[i], new FormControl('', Validators.required));
        }
        else {
            detailGroup.addControl(fieldNamesInDetail[i], new FormControl(''));
        }
    }
    detailFormGroupNames.push(prefixDetailGroupName + detailSize.toString());

    return ++detailSize;
}


export function resetDataToFormGroup(headObj: ToFromJSon, fieldNamesInHeader: string[],
    fieldNamesInDetail: string[], headerFormGroup: FormGroup, prefixDetailGroupName: string,
    detailFormGroupNames: string[], header: Object, detail: Object[], detailSize: number,
    reqdetailNames: string[], blockednames: string[], passtype: string): number {

    let cheaders = null;
    if (passtype == 'Quotes') {
        cheaders = headObj.fromJSON(header as Quotes);
    }
    else if (passtype == 'Orders') {
        cheaders = headObj.fromJSON(header as Orders);
    }

    for (let i = 0; i < fieldNamesInHeader.length; i++) {
        if (blockednames.includes(fieldNamesInHeader[i]))
            continue;
        headerFormGroup.get(fieldNamesInHeader[i]).setValue(
            cheaders.getValue(fieldNamesInHeader[i]));
    }


    if (passtype =='Orders')  return 0;

    // remove original OfferformGroup  
    let ctls = headerFormGroup.controls;
    let controlNames = Object.keys(ctls);

    for (let n of controlNames) {
        if (prefixDetailGroupName && n.indexOf(prefixDetailGroupName) >= 0) {
            headerFormGroup.removeControl(n);
        }
    }
    // clear original array without creating new object
    detailFormGroupNames.splice(0, detailFormGroupNames.length);

    if (passtype =='Quotes')
        detail.splice(0, detail.length);;

    let detailsObj = null;

    if (passtype =='Quotes'  ) {
        detailsObj = (header as Quotes).offers;
    }
    else if (passtype =='Offers') {
        detailsObj =detail as Offers[];
    }

    // new Size
    if (detailsObj && detailsObj.length > 0) {
        detailSize = detailsObj.length;
        // add detailGroups and set value from server side
        for (let i = 0; i < detailSize; i++) {
            let cdetails = null;
            if (passtype == 'Quotes' || passtype =='Offers')
                cdetails = new COffers().fromJSON(detailsObj[i]) as Offers;

            detailFormGroupNames.push(prefixDetailGroupName + i.toString());
            headerFormGroup.addControl(prefixDetailGroupName + i.toString(), new FormGroup({ }));

            for (let j = 0; j < fieldNamesInDetail.length; j++) {
                if (reqdetailNames.includes(fieldNamesInDetail[j])) {
                    (<FormGroup>headerFormGroup.get(prefixDetailGroupName + i.toString())).
                        addControl(fieldNamesInDetail[j],
                        new FormControl(cdetails.getValue(fieldNamesInDetail[j]), Validators.required));
                }
                else {
                    (<FormGroup>headerFormGroup.get(prefixDetailGroupName + i.toString())).
                        addControl(fieldNamesInDetail[j],
                        new FormControl(cdetails.getValue(fieldNamesInDetail[j])));
                }
            }
        }

        detail = detailsObj;
    }
    else { // only display detail row names
        detailSize = 0;
    }

    return detailSize;

}




function copyFormHeaderData(fieldNamesInHeader:string[], blockednames:string[], 
    headerFormGroup:FormGroup, header: Object, passtype: string): Object {

    let headerG = null;
    let cheaders = null;

    if (passtype =='Quotes') {
        headerG = {} as Quotes;
        cheaders = new CQuotes();
    }
    else if (passtype =='Orders') {
        headerG = {} as Orders;
        cheaders = new COrders();
    }

    if (cheaders == null) return header;

    for (let i = 0; i < fieldNamesInHeader.length; i++) {
        if (blockednames.includes(fieldNamesInHeader[i]))
            continue;
        cheaders.setValue(fieldNamesInHeader[i], headerFormGroup.get(
            fieldNamesInHeader[i]).value);
    }

    headerG = cheaders.toJSON();
    header = headerG ;  
    
    if (passtype =='Quotes')
         return header as Quotes;
    else  if (passtype =='Orders') {
        return header as Orders;
    }
}


export function copyFormDetailData (fieldNamesInDetail: string[], detailG: Array<FormGroup>,  
    header: Object, detail: Object[], passtype: string) : Object {

    let detailTemp: Object[] = [];

    for (let i = 0; i < detailG.length; i++) {

        let detailCopy = null;
        let cdetails = null;

        if (passtype == 'Quotes' || passtype == 'Offers') {
            detailCopy = {} as Offers;
            cdetails = new COffers();;
        }
        else if (1) {

        }

        for (let j = 0; j < fieldNamesInDetail.length; j++) {
            cdetails.setValue(fieldNamesInDetail[j], detailG[i].get(
                fieldNamesInDetail[j]).value);
        }

        detailCopy = cdetails.toJSON();
        // required field existing, so it is not empty offer detail
        if (detailCopy.item) {
            // if existing, remove old one, may need to put offer_no in form
            detailTemp.push(detailCopy);
        }
    }

    // Add offers into header
    detail = detailTemp;

    if (passtype =='Quotes') {
        (header as Quotes).offers = detail as Offers[];
        return header as Quotes;
    }
    else if (passtype =='Offers') {
        return detail[0] as Offers;
    }
    else {
        return [];
    }

}


export function transferFormDataToPostData( fieldNamesInHeader: string[],
    fieldNamesInDetail: string[], headerFormGroup: FormGroup, prefixDetailGroupName: string,
     header: Object, detail: Object[], blockednames: string[], passtype: string): Object {

    header = copyFormHeaderData(fieldNamesInHeader, blockednames, headerFormGroup, header, passtype);

    if (passtype == 'Orders') return header as Orders;;

    // copy value from control to Offers Object
    let detailG: Array<FormGroup> = [];
    let ctls = headerFormGroup.controls;
    let controlNames = Object.keys(ctls);

    for (let n of controlNames) {
        if (n.indexOf(prefixDetailGroupName) >= 0) {
            detailG.push(headerFormGroup.get(n) as FormGroup);
        }
    }

   
    // Loop Form Groups in detail
    header = copyFormDetailData(fieldNamesInDetail, detailG, header, detail, passtype);

    if (passtype == 'Quotes')
        return header as Quotes;
    else if (passtype =='Offers') {
        return header as Offers;
    }
    else {
        return {};
    }
    
}