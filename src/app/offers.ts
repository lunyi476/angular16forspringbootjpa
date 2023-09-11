import { Quotes } from './quotes';
import { ToFromJSon } from './tofromjson';

export interface Offers  {
   
    offer_no? : number;
    owner: string;
    item: string;
    description?: string;
    request_no: number;    
    offer_date?: Date;
    status?: string;
    buyer: string;
    supplier?: string;
    vendor_name?: string;
    manufacturer?: string;
    carrier?: string;
    delivery_terms?: string;
    payment_type?: string;
    payment_terms?: string;
    currency: string;
    origin_cntry?: string;
    first_ship_date?: Date;
    last_ship_date?: Date;
    lading_point:string;
    final_dest?: string;
    quote?: Quotes; 
};


// Help class
export class COffers extends ToFromJSon  {
    offer_no? : number;
    owner: string;
    item: string;
    description?: string;
    request_no: number;  
    offer_date?: Date;
    status?: string;
    buyer: string;
    supplier?: string;
    vendor_name?: string;
    manufacturer?: string;
    carrier?: string;
    delivery_terms?: string;
    payment_type?: string;
    payment_terms?: string;
    currency: string;
    origin_cntry?: string;
    first_ship_date?: Date;
    last_ship_date?: Date;
    lading_point:string;
    final_dest?: string;   
    quote?: Quotes;

    constructor () { super();}

    setValue (name: string, val: any) : void {

        switch (name) {
            case 'offer_no' : this.offer_no = val; break;
            case 'owner' : this.owner = val; break;
            case 'item' : this.item = val; break;
            case 'request_no' : this.request_no = val; break;  
            case 'description' : this.description = val; break;
            case 'offer_date' : this.offer_date = val; break;
            case 'status' : this.status = val; break;
            case 'buyer' : this.buyer = val; break;
            case 'supplier' : this.supplier = val; break;
            case 'vendor_name' : this.vendor_name = val; break;
            case 'manufacturer' : this.manufacturer = val; break;
            case 'carrier' : this.carrier = val; break;
            case 'delivery_terms' : this.delivery_terms = val; break;
            case 'payment_type' : this.payment_type = val; break;
            case 'payment_terms' : this.payment_terms = val; break;
            case 'currency' : this.currency = val; break;
            case 'origin_cntry' : this.origin_cntry = val; break;
            case 'first_ship_date' : this.first_ship_date = val; break;
            case 'last_ship_date' : this.last_ship_date = val; break;
            case 'lading_point' : this.lading_point = val; break;
            case 'final_dest' : this.final_dest = val; break;   
        }
    }


    getValue (name: string) : any {
        let val: any;
        switch (name) {
               case 'offer_no' : val = this.offer_no; break;
               case 'owner' : val = this.owner; break;
               case 'item' : val = this.item; break;
               case 'request_no' : val = this.request_no; break;  
               case 'description' : val = this.description; break;
               case 'offer_date' : val = this.offer_date; break;
               case 'status' : val = this.status; break;
               case 'buyer' : val = this.buyer; break;
               case 'supplier' : val = this.supplier; break;
               case 'vendor_name' : val = this.vendor_name; break;
               case 'manufacturer' : val = this.manufacturer; break;
               case 'carrier' : val = this.carrier; break;
               case 'delivery_terms' : val = this.delivery_terms; break;
               case 'payment_type' : val = this.payment_type; break;
               case 'payment_terms' : val = this.payment_terms; break;
               case 'currency' : val = this.currency; break;
               case 'origin_cntry' : val = this.origin_cntry; break;
               case 'first_ship_date' : val = this.first_ship_date; break;
               case 'last_ship_date' : val = this.last_ship_date; break;
               case 'lading_point' : val = this.lading_point; break;
               case 'final_dest' : val = this.final_dest; break;  
               default: break; 
           }

           return val;
    }

    toJSON(): Offers {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

   fromJSON(json: Offers|string): COffers {
        if (typeof json === 'string') {
          // if it's a string, parse it first
          return JSON.parse(json, COffers.reviver);
        } else {
          // create an instance of the User class
          let coffers = Object.create(COffers.prototype);
          // copy all the fields from the json object
          return Object.assign(coffers, json, {
            // convert fields that need converting
            //offer_no: Number(json.offer_no),
            //request_no: Number(json.request_no),
          });
        }
      }
    
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call COffers.fromJSON on the resulting value.
    static reviver(key: string, value: any): any {
      return key === "" ? new COffers().fromJSON(value) : value;
    }
}


export const fieldNamesInOffer =['offer_no', 'owner','item',  'description', 'request_no', 'offer_date',
'status','buyer','supplier','vendor_name','manufacturer', 'carrier','delivery_terms','payment_type',
'payment_terms','currency','origin_cntry','first_ship_date','last_ship_date','lading_point','final_dest'];


export const printNamesBuild =['item', 'buyer', 'supplier','vendor_name','offer_date','delivery_terms','payment_terms',
'currency','last_ship_date','lading_point'];

export const notprintNamesBuild = ['owner', 'offer_no', 'description','request_no', 'status','manufacturer', 'carrier',
'delivery_terms','payment_terms', 'origin_cntry','first_ship_date','final_dest'];
