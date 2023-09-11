import { ToFromJSon } from './tofromjson';

export interface Orders  {
   
    order_no? : number;
    offer_no? : number;
    owner: string;
    item: string;
    description?: string; 
    order_date?: Date;
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
    tot_grs_value: number;
    tot_calc_cost: number;
    tot_qty: number; 
    tot_grs_wgt: number;
    modify_ts: Date;
    modify_user: Date;
};


// Help class
export class COrders extends ToFromJSon  {
    order_no? : number;
    offer_no? : number;
    owner: string;
    item: string;
    description?: string; 
    order_date?: Date;
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
    tot_grs_value: number;
    tot_calc_cost: number;
    tot_qty: number; 
    tot_grs_wgt: number;
    modify_ts: Date;
    modify_user: Date; 

    constructor () { super();}

    setValue (name: string, val: any) : void {

        switch (name) {
            case 'order_no' : this.order_no = val; break;
            case 'offer_no' : this.offer_no = val; break;
            case 'owner' : this.owner = val; break;
            case 'item' : this.item = val; break;
            case 'description' : this.description = val; break;
            case 'order_date' : this.order_date = val; break;
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
            case 'tot_grs_value': this.tot_grs_value = val; break;;
            case 'tot_calc_cost': this.tot_calc_cost = val; break;;
            case 'tot_qty': this.tot_qty = val; break;; 
            case 'tot_grs_wgt': this.tot_grs_wgt = val; break;;
            case 'modify_ts': this.modify_ts = val; break;;
            case 'modify_user': this.modify_user = val; break;;  
        }
    }


    getValue (name: string) : any {
        let val: any;
        switch (name) {
               case 'order_no' : val = this.order_no; break;
               case 'offer_no' : val = this.offer_no; break;
               case 'owner' : val = this.owner; break;
               case 'item' : val = this.item; break;
               case 'description' : val = this.description; break;
               case 'order_date' : val = this.order_date; break;
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
               case 'tot_grs_value': val = this.tot_grs_value; break;;
               case 'tot_calc_cost': val = this.tot_calc_cost ; break;;
               case 'tot_qty': val = this.tot_qty ; break;; 
               case 'tot_grs_wgt': val = this.tot_grs_wgt ; break;;
               case 'modify_ts': val = this.modify_ts ; break;;
               case 'modify_user': val = this.modify_user ; break;;   
               default: break; 
           }

           return val;
    }

    toJSON(): Orders {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

   fromJSON(json: Orders|string): COrders {
        if (typeof json === 'string') {
          // if it's a string, parse it first
          return JSON.parse(json, COrders.reviver);
        } else {
          // create an instance of the User class
          let coffers = Object.create(COrders.prototype);
          // copy all the fields from the json object
          return Object.assign(coffers, json, {
            // convert fields that need converting
            //offer_no: Number(json.offer_no),
            //request_no: Number(json.request_no),
          });
        }
      }
    
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call COrders.fromJSON on the resulting value.
    static reviver(key: string, value: any): any {
      return key === "" ? new COrders().fromJSON(value) : value;
    }
}


export const fieldNamesInOrder =['order_no', 'offer_no', 'owner','item',  'description',  'order_date',
'status','buyer','supplier','vendor_name','manufacturer', 'carrier','delivery_terms','payment_type',
'payment_terms','currency','origin_cntry','first_ship_date','last_ship_date','lading_point','final_dest',
'tot_grs_value','tot_calc_cost','tot_qty','tot_grs_wgt','modify_ts','modify_user'];

export const printNamesInOrder =['owner','item',  'description',  'order_date',
'status','buyer','supplier','vendor_name','manufacturer', 'carrier','delivery_terms','payment_type',
'payment_terms','currency','origin_cntry','first_ship_date','last_ship_date','lading_point','final_dest',
'tot_grs_value','tot_calc_cost','tot_qty','tot_grs_wgt'];
